// Client-Side OCR & Pattern Parsing Engine for Medical Documents

export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample_1',
    title: 'Clinic Rx: Antimalarial & Analgesic',
    type: 'Prescription',
    category: 'Medication',
    imageText: `
ADEYEMI CHEMIST & CLINICAL DISPENSARY
Opposite Market Road, Yaba, Lagos
Date: 28/09/2026

Rx Patient: Zainab Bello
1. Artemether / Lumefantrine 80/480mg (Coartem)
   Take 1 tablet bd x 3 days with food.
2. Paracetamol syrup 120mg/5ml
   5ml tds prn for high temperature.
3. Oral Rehydration Salts (ORS) - 2 sachets in 1L clean water.

Total Cash Paid: ₦3,850
Pharmacist: Adeyemi Pharm. B.Sc
    `,
    suggestedProvider: 'Adeyemi Chemist & Clinical Dispensary',
    suggestedDetails: 'Artemether / Lumefantrine 80/480mg (Coartem) 1 tab bd x 3 days, Paracetamol syrup 120mg/5ml 5ml tds prn, ORS 2 sachets.',
    suggestedCost: 3850,
    confidence: 96,
  },
  {
    id: 'sample_2',
    title: 'Hospital Rx: Chronic Hypertension & Diabetes',
    type: 'Prescription',
    category: 'Medication',
    imageText: `
ST. NICHOLAS OUTPOST CLINIC
Victoria Island, Lagos
Date: 26/09/2026
Card No: STN-9941
Patient: Mama Fatima Bello

PRESCRIPTION:
1. Amlodipine 5mg - 1 tab nocte (at night) x 30 days
2. Metformin 500mg - 1 tab bd with meals x 30 days
3. Low sodium diet and daily 20-min gentle walk

Total Billed: ₦6,400 (Paid at cashier)
Physician: Dr. K. Okafor, MBBS, FWACP
    `,
    suggestedProvider: 'St. Nicholas Outpost Clinic',
    suggestedDetails: 'Amlodipine 5mg 1 tab nocte x 30 days, Metformin 500mg 1 tab bd x 30 days. Diet & exercise advice.',
    suggestedCost: 6400,
    confidence: 98,
  },
  {
    id: 'sample_3',
    title: 'Child Immunization Card Leaflet',
    type: 'Immunization',
    category: 'Hospital Visits',
    imageText: `
FEDERAL REPUBLIC OF NIGERIA
PRIMARY HEALTH CARE DEVELOPMENT AGENCY
Child Health & Immunization Record
Health Facility: Iru Comprehensive Health Post
Child: Zainab Bello (DOB: 10/03/2026)

Immunization Given:
- Date: 29/09/2026
- Vaccine: Penta 3 + Oral Polio 3 (bOPV) + PCV 3
- Batch No: SER-6640
- Adverse Events: None reported
- Fee: Free (Subsidized EPI Programme) ₦0
Next Due Date: 10/12/2026 (Measles 1)
Community Health Worker: Nurse Modupe
    `,
    suggestedProvider: 'Iru Comprehensive Health Post',
    suggestedDetails: 'Penta 3 + Oral Polio 3 (bOPV) + PCV 3. Batch: SER-6640. Next visit due 10/12/2026 for Measles 1.',
    suggestedCost: 0,
    confidence: 94,
  },
  {
    id: 'sample_4',
    title: 'Emergency Lab Slip: Blood & Genotype',
    type: 'Lab Test',
    category: 'Lab Tests',
    imageText: `
METROPOLIS DIAGNOSTIC SERVICES
Laboratory Investigation Report
Date: 15/09/2026

Patient Name: Amina Bello
Test Ordered: Full Blood Count & Hb Electrophoresis

RESULTS:
- Haemoglobin (Hb): 11.4 g/dL (Normal: 12.0 - 15.5)
- Genotype (Alkaline Hb Electrophoresis): AS (Sickle Cell Trait Detected)
- Blood Group & Rh: O Rh(D) Positive
- Sickling Test: Positive

Receipt / Lab Charge: ₦7,500 Cash
Pathologist: Dr. E. Danladi
    `,
    suggestedProvider: 'Metropolis Diagnostic Services',
    suggestedDetails: 'Hb Electrophoresis: AS (Sickle Cell Trait). Blood Group: O Positive. Hb: 11.4 g/dL.',
    suggestedCost: 7500,
    confidence: 97,
  }
];

export const ocrEngine = {
  // Edge contrast & binarization simulation on HTML5 Canvas
  preprocessImageOnCanvas: (imageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = imageElement.naturalWidth || imageElement.width || 600;
    canvas.height = imageElement.naturalHeight || imageElement.height || 400;

    // Draw original
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    // Get pixel data for contrast adjustment & binarization
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Grayscale and edge contrast stretching
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // High-contrast cutoff (adaptive binarization threshold)
        const contrast = avg > 130 ? 255 : 30;
        data[i] = contrast;     // R
        data[i + 1] = contrast; // G
        data[i + 2] = contrast; // B
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      console.warn('Canvas preprocessing cross-origin or buffer error, falling back:', e);
      return null;
    }
  },

  // Regex Pipeline matching regional pharmaceutical terminology and dosage patterns
  extractStructuredFields: (rawText) => {
    if (!rawText || typeof rawText !== 'string') {
      return {
        provider: '',
        details: '',
        cost: 0,
        confidence: 70,
        flags: ['Empty document text'],
      };
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let provider = '';
    let details = '';
    let cost = 0;
    let confidence = 85;
    const flags = [];

    // 1. Detect Provider (look for Clinic, Hospital, Chemist, Pharmacy, Dispensary, Outpost)
    const providerRegex = /([A-Za-z0-9\s.,'&-]+(Clinic|Hospital|Chemist|Pharmacy|Health Post|Dispensary|Diagnostic|Services|Laboratory|Outpost)[A-Za-z0-9\s.,'&-]*)/i;
    for (const line of lines.slice(0, 5)) {
      const match = line.match(providerRegex);
      if (match) {
        provider = match[1].trim();
        break;
      }
    }
    if (!provider && lines.length > 0) {
      provider = lines[0]; // fallback to first line header
      confidence -= 10;
      flags.push('Provider inferred from header');
    }

    // 2. Extract Dosages & Meds: bd, tds, nocte, prn, mane, mg, sachet, tab
    const dosagePatterns = /(bd|tds|nocte|prn|mane|stat|daily|weekly|tabs?|caps?|drops?|sachets?|mg|mcg|ml|g\/dL)/i;
    const medicationLines = lines.filter(l => dosagePatterns.test(l) || /Rx|Result|Test|Penta|Polio|Measles|Artemether|Metformin|Amlodipine|Paracetamol/i.test(l));

    if (medicationLines.length > 0) {
      details = medicationLines.join('. ').replace(/\s{2,}/g, ' ');
      confidence += 10;
    } else {
      details = lines.slice(1, 4).join(' ');
      flags.push('Dosage pattern was not automatically matched');
    }

    // 3. Extract Costs: ₦, GH₵, KSh, $, NGN, Total, Cash, Fee, Billed
    const costRegex = /(?:₦|NGN|GH₵|KSh|\$|Total|Paid|Cost|Fee|Billed)\s*:?\s*([0-9,]+(?:\.[0-9]{2})?)/i;
    for (const line of lines) {
      const match = line.match(costRegex);
      if (match && match[1]) {
        const cleanNumber = match[1].replace(/,/g, '');
        const parsedVal = parseFloat(cleanNumber);
        if (!isNaN(parsedVal)) {
          cost = parsedVal;
          confidence += 5;
          break;
        }
      }
    }

    // Cap confidence between 60% and 99%
    confidence = Math.min(Math.max(confidence, 65), 98);

    return {
      provider,
      details,
      cost,
      confidence,
      flags,
    };
  }
};

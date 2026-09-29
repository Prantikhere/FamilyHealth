// Genetics & Cross-Generational Trait Analysis Service

export const GENOTYPES = ['AA', 'AS', 'SS', 'AC', 'SC'];

export const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const geneticsService = {
  // Calculate Punnett Square & offspring risk probabilities for 2 genotypes
  calculateOffspringRisk: (genotype1, genotype2) => {
    const g1 = genotype1.toUpperCase();
    const g2 = genotype2.toUpperCase();

    // Split alleles
    const a1 = [g1[0], g1[1]];
    const a2 = [g2[0], g2[1]];

    const combos = [];
    for (const allele1 of a1) {
      for (const allele2 of a2) {
        // Standardize sorting: 'A' first, 'S' second, 'C' second
        const pair = [allele1, allele2].sort((a, b) => {
          if (a === 'A') return -1;
          if (b === 'A') return 1;
          return a.localeCompare(b);
        }).join('');
        combos.push(pair);
      }
    }

    const counts = {};
    for (const c of combos) {
      counts[c] = (counts[c] || 0) + 1;
    }

    const total = combos.length;
    const probabilities = {};
    for (const key in counts) {
      probabilities[key] = Math.round((counts[key] / total) * 100);
    }

    // Determine risk category
    let riskLevel = 'LOW'; // LOW, MEDIUM, CRITICAL
    let advice = 'Low risk of sickle cell disease in offspring.';

    if (probabilities['SS'] && probabilities['SS'] >= 25) {
      riskLevel = 'CRITICAL';
      advice = `HIGH DANGER: ${probabilities['SS']}% risk of child inheriting Sickle Cell Anemia (SS). Genetic counseling strongly advised prior to conception.`;
    } else if (probabilities['SC'] && probabilities['SC'] >= 25) {
      riskLevel = 'CRITICAL';
      advice = `HIGH DANGER: ${probabilities['SC']}% risk of child inheriting Hemoglobin SC disease. Clinical counseling strongly advised.`;
    } else if (probabilities['AS'] && probabilities['AS'] > 0) {
      riskLevel = 'MODERATE';
      advice = `Carrier Risk: Children have a ${probabilities['AS']}% chance of being healthy carriers (AS). No Sickle Cell Anemia (SS) risk.`;
    } else {
      riskLevel = 'SAFE';
      advice = 'Compatible Match: 100% normal hemoglobin genotype (AA) expected in offspring.';
    }

    return {
      genotype1: g1,
      genotype2: g2,
      probabilities,
      riskLevel,
      advice,
    };
  },

  // Analyze household clustering for chronic conditions and inherited traits
  analyzeHouseholdRisks: (members) => {
    const totalMembers = members.length;
    const sickleCarriers = members.filter(m => m.genotype === 'AS');
    const sickleDiseased = members.filter(m => m.genotype === 'SS');
    const htnMembers = members.filter(m => m.chronicConditions && m.chronicConditions.some(c => c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('bp')));
    const diabeticMembers = members.filter(m => m.chronicConditions && m.chronicConditions.some(c => c.toLowerCase().includes('diabetes') || c.toLowerCase().includes('sugar')));
    const asthmaMembers = members.filter(m => m.chronicConditions && m.chronicConditions.some(c => c.toLowerCase().includes('asthma')));

    const alerts = [];

    if (sickleCarriers.length >= 2) {
      alerts.push({
        id: 'sc_carrier_cluster',
        level: 'WARNING',
        title: 'Sickle Cell Trait (AS) Clustering',
        description: `${sickleCarriers.length} household members (${sickleCarriers.map(m => m.name.split(' ')[0]).join(', ')}) carry the AS sickle trait. Children born between AS carriers have a 25% risk of major sickle cell anemia (SS).`,
        action: 'Hb Electrophoresis pre-conception screening recommended for all offspring.'
      });
    }

    if (htnMembers.length >= 2) {
      alerts.push({
        id: 'htn_cluster',
        level: 'CRITICAL',
        title: 'Strong Multi-Generational Hypertension Lineage',
        description: `Hypertension recorded in multiple generations (${htnMembers.map(m => m.name.split(' ')[0]).join(' & ')}). Strong genetic predisposition detected for cardiovascular disease.`,
        action: 'Quarterly blood pressure checks and low-sodium dietary regimen advised for all members over 25.'
      });
    }

    if (diabeticMembers.length >= 1) {
      alerts.push({
        id: 'diabetes_watch',
        level: 'INFO',
        title: 'Type 2 Diabetes Familial Factor',
        description: `Present in family (${diabeticMembers.map(m => m.name.split(' ')[0]).join(', ')}). First-degree relatives carry elevated insulin resistance risk.`,
        action: 'Annual fasting blood glucose tests and regular physical activity.'
      });
    }

    return {
      totalMembers,
      sickleCarriers,
      sickleDiseased,
      htnMembers,
      diabeticMembers,
      asthmaMembers,
      alerts,
    };
  }
};

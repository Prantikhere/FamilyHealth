# Low-Level Design (LLD) & Technical Architecture Document

## Project: African Family Health Platform ("FamilyHealth")

**Document Version:** 2.4.0

**Target Environment:** Google Cloud Platform (Multi-Region / Edge PoP Lagos & Johannesburg)

**Target Clients:** Android & iOS (Flutter Cross-Platform Engine, Offline-First)

---

# 1. Complete Requirements Traceability Matrix

## 1.1 Functional Requirements (FR)

| ID | Module / Capability | Technical Specification & Operational Rules |
| --- | --- | --- |
| **FR-01** | **Multi-Generational Health Circle** | • Single primary account orchestrates an arbitrary number of dependents ($N \le 32$).<br>

<br>• Supports multiple generational tiers: Grandparents (G0), Parents/Spouse/Self (G1), Children/Wards (G2), Dependents/Collateral (G3).<br>

<br>• Per-member sub-entity containment: profile, active prescriptions, documented allergies, immunization logs, clinical encounters, vitals logs, and emergency payload. |
| **FR-02** | **Visual Lineage Graph & Portraits** | • Interactive pedigree tree canvas visualizing biological and legal custody dependencies.<br>

<br>• Directed acyclic graph (DAG) structure with cyclic prevention checks on assignment.<br>

<br>• Portrait avatar support with on-device WebP compression and local thumbnail caching.<br>

<br>• Real-time hereditary risk annotation overlays (e.g., Sickle Cell traits: HbAA, HbAS, HbSS; familial hypertension). |
| **FR-03** | **Dual-Tier Health Records** | • **Official Records (`OFFICIAL_VERIFIED`):** Ingestion restricted to accredited healthcare facilities, certified diagnostic labs, and registered HMOs. Payload must be cryptographically signed via the issuer’s private key (Ed25519) and verified against the public registry.<br>

<br>• **Self-Reported Records (`SELF_REPORTED`):** Patient-entered metrics (blood pressure, fasting glucose, temperature logs, OTC medications). Distinct UI presentation, clear provenance watermark, zero clinical immutability enforcement. |
| **FR-04** | **Zero-Knowledge Field Encryption** | • Personal Health Information (PHI) encrypted on the client device prior to transport.<br>

<br>• 256-bit AES-GCM envelope encryption using dynamic Data Encryption Keys (DEKs).<br>

<br>• Zero-knowledge backend architecture: GCP services (Cloud Run, Cloud SQL, Memorystore) persist only ciphertexts and lack the private key material necessary to decrypt clinical entries. |
| **FR-05** | **Granular & Delegated Transfer** | • Users can select specific records (e.g., Child A immunization log + Father Cardiology PDF) to compile an ephemeral transfer bundle.<br>

<br>• Access controlled via a 4-digit PIN, salt-hashed using Argon2id.<br>

<br>• Time-bound revocation: auto-expires after a user-defined TTL (1 hour to 7 days) or via instantaneous manual revocation.<br>

<br>• Transfer audit ledger tracking access timestamps, IP addresses, and user-agents. |
| **FR-06** | **Offline Emergency Health Card** | • Compact 2D QR generator capable of operating in dual modes:<br>

<br>  1. *Online Mode:* Resolves to an edge-cached, stripped-down emergency profile.<br>

<br>  2. *Air-Gapped Offline Mode:* QR encodes an ultra-compressed (CBOR + Zstandard) payload containing blood group, genotype, critical allergies, resuscitation orders, and ICE phone numbers directly parseable by any standard offline camera scanner. |
| **FR-07** | **"Know Before You Go" Care Triage** | • Deterministic, rule-based clinical decision support tree.<br>

<br>• Strict legal firewall: outputs health guidance and urgency categorization (Home Care, Community Pharmacy, Primary Care Center, Emergency Room) without diagnostic assertions.<br>

<br>• Integration of red-flag symptom cascades for regional endemic conditions (e.g., severe febrile convulsions, malaria markers, dehydration in cholera outbreaks). |
| **FR-08** | **Vernacular Multilingual Engine** | • Dynamic run-time language localization across English, Nigerian Pidgin, Yoruba, Hausa, and Igbo.<br>

<br>• Slang and colloquial symptom mapping engine (e.g., *"my eye dey turn me"* $\to$ Vertigo/Presyncope).<br>

<br>• Local translation bundles embedded on-device for full offline operation. |
| **FR-09** | **Vaccine Passport & Reminders** | • National immunization schedule automation (e.g., Nigeria Expanded Programme on Immunization - EPI: BCG, OPV, Pentavalent, PCV, Rota, Measles, Yellow Fever).<br>

<br>• Calculation of milestone due dates based on validated birth dates with notification dispatch via local system push, WhatsApp Cloud API, and SMS fallback (Termii). |
| **FR-10** | **Care Discovery & Navigation** | • Geospatial directory of verified hospitals, primary health centers (PHCs), diagnostic labs, and licensed pharmacies.<br>

<br>• PostGIS spatial distance calculations with dynamic filtering (24/7 service, emergency readiness, accepted HMO/NHIA insurance networks). |
| **FR-11** | **Family Health Completeness Index** | • Gamified record completeness score (0–100%) calculated dynamically across active family members.<br>

<br>• Evaluates immunization currency, preventive screening status, and active chronic medication tracking without clinical judgment. |

---

## 1.2 Non-Functional Requirements (NFR)

| Category | Metric / Standard | Technical Enforcement Mechanism |
| --- | --- | --- |
| **Performance** | P95 Latency $\le 200\text{ ms}$ (Read)<br>

<br>P95 Latency $\le 500\text{ ms}$ (Write) | Edge termination at Google Cloud Edge PoPs (Lagos/Johannesburg) over QUIC/HTTP/3; Redis L2 caching; connection pooling via PgBouncer. |
| **Bandwidth** | Maximum Sync Delta $\le 40\text{ KB}$<br>

<br>Initial Download $\le 25\text{ MB}$ | Protocol Buffers (Protobuf) serialization; Brotli stream compression; client-side image downsampling to WebP format ($\le 1200\text{px}$, quality 75) before transmission. |
| **Resilience** | 100% Core Offline Availability | Encrypted client database (SQLite with SQLCipher); persistent local mutation queue; exponential-backoff sync worker. |
| **Availability** | 99.9% Production Uptime | Multi-zone Cloud Run deployment (min 2 instances warm); Regional Cloud SQL PostgreSQL instance with automated synchronous standby failover. |
| **Security** | Zero-Trust / Zero-Knowledge | TLS 1.3 only; Certificate Pinning on mobile endpoints; AES-256-GCM field encryption; Android Keystore & iOS Keychain hardware security modules (HSMs). |
| **Regulatory** | NDPA 2023, HIPAA, ISO-27001 | Customer-Managed Encryption Keys (CMEK) via Google Cloud KMS; continuous immutable audit logging to Cloud Storage buckets with Object Lock retention. |
| **Scalability** | 1,000 to 500,000 Concurrent Users | Stateless application tier on Cloud Run autoscaling horizontally based on CPU/concurrency triggers ($80\text{ req/container}$). |
| **Data Integrity** | Zero Mutation Loss | Two-phase sync engine utilizing Lamport timestamps, client-generated UUIDv4 keys, and server-side atomic transaction boundaries. |

---

# 2. Design System, Theme & Layout Specifications

To reflect its regional operational reality and avoid generic, clinical aesthetics, the interface uses an authentic visual design system built on high-contrast African earth tones, sturdy typography, and low-cognitive-load navigation.

```
+---------------------------------------------------------------------------------------+
|                                    COLOR PALETTE                                      |
+--------------------+--------------------+--------------------+--------------------+---+
| Terracotta Primary | Forest Palm        | Warm Chalk         | Deep Charcoal      |   |
| #C85A32            | #1E4D38            | #F9F6F0            | #141210            |   |
| (Action & Urgency) | (Trust & Health)   | (App Canvas Base)  | (High-Contrast Ink)|   |
+--------------------+--------------------+--------------------+--------------------+---+
| Ochre Alert        | Indigo Verified    | Sand Container     | Border Rule        |   |
| #D9822B            | #1B2A4A            | #EFE9DF            | #E2DCD2            |   |
| (Self-Reported)    | (Official Seal)    | (Card Surfaces)    | (Structural Grid)  |   |
+--------------------+--------------------+--------------------+--------------------+---+

```

## 2.1 Design Tokens

```json
{
  "theme": {
    "colors": {
      "primary": "#C85A32",
      "primary_container": "#F4DDD4",
      "on_primary": "#FFFFFF",
      "secondary": "#1E4D38",
      "secondary_container": "#D3E4DB",
      "on_secondary": "#FFFFFF",
      "background": "#F9F6F0",
      "surface": "#EFE9DF",
      "surface_variant": "#E4DDD1",
      "on_surface": "#141210",
      "on_surface_muted": "#5C564E",
      "border": "#E2DCD2",
      "provenance_official": "#1B2A4A",
      "provenance_self": "#D9822B",
      "emergency_accent": "#BA1A1A"
    },
    "typography": {
      "font_family_primary": "Plus Jakarta Sans",
      "font_family_display": "Cabinet Grotesk",
      "display_large": { "size": 32, "weight": 800, "line_height": 38 },
      "title_large": { "size": 20, "weight": 700, "line_height": 26 },
      "title_medium": { "size": 16, "weight": 600, "line_height": 22 },
      "body_large": { "size": 15, "weight": 400, "line_height": 22 },
      "body_medium": { "size": 13, "weight": 400, "line_height": 18 },
      "label_small": { "size": 11, "weight": 700, "line_height": 14, "letter_spacing": 0.5 }
    },
    "layout": {
      "touch_target_min": 48,
      "grid_gutter": 16,
      "card_border_radius": 16,
      "chip_border_radius": 8,
      "bottom_nav_height": 72
    }
  }
}

```

---

## 2.2 Structural Layout & Screen Topologies

The interface is anchored by a persistent, high-contrast bottom navigation bar comprising three functional hubs:

1. **Circle (Family Lineage & Context Engine)**
2. **Timeline (Dual-Tier Chronological Ledger)**
3. **Emergency (Zero-Click Crisis Health Card & Triage)**

### Wireframe Topology: Circle & Lineage Graph (Tab 1)

```
+-----------------------------------------------------------+
| [Top App Bar]                                             |
| FamilyHealth               [Lang: Pidgin v]  [Alerts (2)] |
+-----------------------------------------------------------+
| [Emergency Quick-Action Strip]                            |
| +-------------------------------------------------------+ |
| | [!] EMERGENCY CARD: ADEYEMI           [SHOW QR CODE]  | |
| | Blood: O+  |  Genotype: AS  |  Penicillin Allergy     | |
| +-------------------------------------------------------+ |
|                                                           |
| [Lineage Tree Canvas (Pan & Zoom)]                        |
|                                                           |
|            +---------------+     +---------------+        |
|            | Baba (G0)     |     | Iya (G0)      |        |
|            | (BP Watch)    |     | (Normal)      |        |
|            +-------+-------+     +-------+-------+        |
|                    |                     |                |
|                    +----------+----------+                |
|                               |                           |
|                    +----------+----------+                |
|                    | Femi [Self] (G1)    |                |
|                    | O+ | AA             |                |
|                    +----------+----------+                |
|                               |                           |
|            +------------------+------------------+        |
|            |                                     |        |
|    +-------+-------+                     +-------+------+ |
|    | Tunde (G2)    |                     | Sade (G2)    | |
|    | (Vaccine Due) |                     | (Normal)     | |
|    +---------------+                     +--------------+ |
|                                                           |
| [Family Health Completeness Matrix]                       |
| +-------------------------------------------------------+ |
| | Family Health Check: 88% Complete                     | |
| | [========                                           ] | |
| | * 1 Vaccine Overdue (Tunde)  * 1 BP Unchecked (Baba)  | |
| +-------------------------------------------------------+ |
+-----------------------------------------------------------+
| [Bottom Nav Bar]                                          |
|    [ (o) Circle ]         [ (=) Timeline ]       [ (!) SOS ]  |
+-----------------------------------------------------------+

```

---

### Wireframe Topology: Dual-Tier Timeline & Granular Transfer (Tab 2)

```
+-----------------------------------------------------------+
| [Top App Bar]                                             |
| Timeline: All Members               [Filter v]  [Export ] |
+-----------------------------------------------------------+
| [Selective Transfer Activation Bar]                       |
| Select records below to generate temporary doctor PIN     |
| [Transfer Selected (0)]                                   |
+-----------------------------------------------------------+
| [Timeline Feed Engine]                                    |
|                                                           |
| 24 OCT 2026                                               |
| +-------------------------------------------------------+ |
| | [ ] [OFFICIAL VERIFIED SEAL]              Tunde (G2)  | |
| | Pentavalent 3rd Dose (Immunization)                   | |
| | Issued by: General Hospital Ikeja                     | |
| | Digital Signature: [Verified Ed25519]                 | |
| | [View Certificate]                  [Share Record ↗]  | |
| +-------------------------------------------------------+ |
|                                                           |
| 23 OCT 2026                                               |
| +-------------------------------------------------------+ |
| | [ ] [SELF-REPORTED ENTRY]                  Baba (G0)  | |
| | Morning Blood Pressure Log                            | |
| | Systolic: 142 mmHg | Diastolic: 88 mmHg (Elevated)    | |
| | Logged by: Femi (Self) via Omron Monitor              | |
| | Note: Complained of mild headache                     | |
| +-------------------------------------------------------+ |
|                                                           |
| 15 SEP 2026                                               |
| +-------------------------------------------------------+ |
| | [ ] [OFFICIAL VERIFIED SEAL]             Femi (Self)  | |
| | Comprehensive Metabolic Panel (Lab Result)            | |
| | Issued by: Synlab Lagos                               | |
| | [View Encrypted Report PDF]         [Share Record ↗]  | |
| +-------------------------------------------------------+ |
+-----------------------------------------------------------+
| [Bottom Nav Bar]                                          |
|    [ ( ) Circle ]         [ (=) Timeline ]       [ (!) SOS ]  |
+-----------------------------------------------------------+

```

---

### Wireframe Topology: Emergency Health Card & Offline QR (Tab 3)

```
+-----------------------------------------------------------+
| [Emergency Mode Active]                    [Close Mode X] |
+-----------------------------------------------------------+
|                                                           |
|                EMERGENCY HEALTH CARD                      |
|              Adeyemi, Babatunde (Father)                  |
|                                                           |
|           +-------------------------------+               |
|           |  ##### ####### ####### #####  |               |
|           |  #   # #     # #     # #   #  |               |
|           |  #   # # ### # # ### # #   #  |               |
|           |  ##### ####### ####### #####  |               |
|           |  ##### ## #### #### ## #####  |               |
|           |  # ###   # # # # # #   ### #  |               |
|           |  ##### ####### ####### #####  |               |
|           +-------------------------------+               |
|           Offline Scan: Direct CBOR Decryption            |
|                                                           |
| +-------------------------------------------------------+ |
| | CRITICAL MEDICAL ATTRIBUTES                           | |
| | Blood Group: O+                  Genotype: AS         | |
| | Severe Allergies: Penicillin, Cephalosporins          | |
| | Resuscitation Order: Full Code (CPR / Intubation)     | |
| | Chronic Conditions: Essential Hypertension (Grade 1)  | |
| +-------------------------------------------------------+ |
|                                                           |
| [Direct Emergency Contacts (One-Touch Call)]              |
| +-------------------------------------------------------+ |
| | [CALL] Sade Adeyemi (Wife)            +234 802 334 1122| |
| | [CALL] Dr. Babajide (Cardiologist)    +234 803 998 0011| |
| +-------------------------------------------------------+ |
|                                                           |
| [Care Triage Engine Entry]                                |
| [ > "KNOW BEFORE YOU GO" SYMPTOM TRIAGE ]                 |
+-----------------------------------------------------------+

```

---

# 3. Complete Data Architecture & Relational Schema

The physical persistence tier is divided between **Cloud SQL PostgreSQL 16 (Server Engine)** and **SQLite with SQLCipher (Client Offline Engine)**.

## 3.1 Cloud SQL Physical Database Schema (DDL)

```sql
-- Schema Definition: African Family Health Platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Enumerations
CREATE TYPE user_role_type AS ENUM ('PRIMARY_OWNER', 'FAMILY_ADMIN', 'MEMBER', 'READ_ONLY');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN');
CREATE TYPE genotype_type AS ENUM ('AA', 'AS', 'SS', 'AC', 'SC', 'UNKNOWN');
CREATE TYPE record_provenance_type AS ENUM ('OFFICIAL_VERIFIED', 'SELF_REPORTED');
CREATE TYPE record_category_type AS ENUM (
    'VACCINATION', 
    'PRESCRIPTION', 
    'LAB_RESULT', 
    'CLINICAL_ENCOUNTER', 
    'VITALS_LOG', 
    'ALLERGY_DECLARATION'
);

-- 2. Family Account Context
CREATE TABLE families (
    family_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(120) NOT NULL,
    primary_contact_phone VARCHAR(24) NOT NULL,
    root_state_hash VARCHAR(64) NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    current_sync_version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_families_phone ON families(primary_contact_phone);

-- 3. Family Members Table (Lineage Directed Graph)
CREATE TABLE family_members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(family_id) ON DELETE CASCADE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    gender gender_type NOT NULL,
    date_of_birth DATE NOT NULL,
    avatar_url TEXT,
    blood_group blood_group_type DEFAULT 'UNKNOWN',
    genotype genotype_type DEFAULT 'UNKNOWN',
    father_id UUID REFERENCES family_members(member_id) ON DELETE SET NULL,
    mother_id UUID REFERENCES family_members(member_id) ON DELETE SET NULL,
    national_identity_num VARCHAR(32), -- Encrypted NIN
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    primary_phone VARCHAR(24),
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_lineage_no_self_parent CHECK (
        (father_id IS NULL OR father_id <> member_id) AND 
        (mother_id IS NULL OR mother_id <> member_id)
    )
);

CREATE INDEX idx_members_family_id ON family_members(family_id);
CREATE INDEX idx_members_parents ON family_members(father_id, mother_id);

-- 4. Accredited Institutions Registry (Official Record Issuers)
CREATE TABLE accredited_institutions (
    institution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_name VARCHAR(150) NOT NULL,
    regulatory_license_num VARCHAR(80) NOT NULL UNIQUE,
    ed25519_public_key VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Dual-Tier Health Records (Envelope Encrypted)
CREATE TABLE health_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES family_members(member_id) ON DELETE CASCADE,
    provenance record_provenance_type NOT NULL,
    category record_category_type NOT NULL,
    title VARCHAR(180) NOT NULL,
    recorded_date TIMESTAMPTZ NOT NULL,
    
    -- Envelope Encryption Vector (Zero-Knowledge)
    encrypted_payload BYTEA NOT NULL,
    encrypted_data_key BYTEA NOT NULL,
    initialization_vector BYTEA NOT NULL,
    authentication_tag BYTEA NOT NULL,
    
    -- Attestation Verification Attributes
    institution_id UUID REFERENCES accredited_institutions(institution_id),
    attestation_signature BYTEA,
    document_storage_path TEXT,
    document_sha256 VARCHAR(64),
    
    -- Distributed Consistency Counters
    sync_version BIGINT NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_records_lookup ON health_records(member_id, recorded_date DESC);
CREATE INDEX idx_health_records_version ON health_records(member_id, sync_version);

-- 6. Granular Document Transfers & Delegated Tokens
CREATE TABLE document_transfers (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(family_id) ON DELETE CASCADE,
    issued_by_member_id UUID NOT NULL REFERENCES family_members(member_id),
    recipient_descriptor VARCHAR(120) NOT NULL,
    pin_salt VARCHAR(64) NOT NULL,
    pin_hash VARCHAR(128) NOT NULL,
    ephemeral_public_key TEXT NOT NULL,
    accessible_record_ids JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    access_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transfers_active ON document_transfers(transfer_id) 
WHERE revoked IS FALSE;

-- 7. Healthcare Facilities Directory (PostGIS Engine)
CREATE TABLE healthcare_facilities (
    facility_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name VARCHAR(150) NOT NULL,
    facility_type VARCHAR(50) NOT NULL, -- HOSPITAL, PHC, PHARMACY, DIAGNOSTIC
    location GEOGRAPHY(Point, 4326) NOT NULL,
    phone_number VARCHAR(24) NOT NULL,
    operating_hours VARCHAR(100),
    has_emergency_service BOOLEAN DEFAULT FALSE,
    accepted_hmo_networks TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_facilities_geography ON healthcare_facilities USING GIST(location);

```

---

## 3.2 Client SQLite/SQLCipher Physical Schema

The client maintains an identical schema offline, supplemented with an execution journal for syncing:

```sql
-- SQLite Local Replication Table
CREATE TABLE local_sync_mutation_queue (
    mutation_id TEXT PRIMARY KEY,        -- UUIDv4
    entity_table TEXT NOT NULL,          -- 'family_members', 'health_records'
    entity_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK(operation IN ('INSERT', 'UPDATE', 'DELETE')),
    payload_json TEXT NOT NULL,
    device_timestamp INTEGER NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT
);

CREATE INDEX idx_queue_order ON local_sync_mutation_queue(device_timestamp ASC);

```

---

# 4. Zero-Knowledge Cryptographic & Transfer Protocol

The platform implements an envelope encryption architecture that guarantees **Zero-Knowledge persistence**. The central GCP cloud servers store ciphertexts without possessing the decryption keys.

```
+---------------------------------------------------------------------------------------+
|                       CLIENT-SIDE ENVELOPE ENCRYPTION PROTOCOL                        |
+---------------------------------------------------------------------------------------+
                                        |
                 [Plaintext Record / Clinical Observation]
                                        |
                   +--------------------+--------------------+
                   |                                         |
                   v                                         v
       [Generate Random 256-bit]                    [Compute SHA-256 Digest]
       [DEK via CSPRNG (Secure)]                             |
                   |                                         v
                   v                                [Sign via User Ed25519]
      [Encrypt via AES-256-GCM]                     [Hardware Private Key]
                   |                                         |
         +---------+---------+                               v
         |                   |                      [Digital Signature]
         v                   v                               |
    [Ciphertext]     [128-bit Auth Tag]                      |
         |                   |                               |
         +---------+---------+                               |
                   |                                         |
                   v                                         |
       [Wrap DEK via Master KEK]                             |
       (Argon2id Salted PIN Key)                             |
                   |                                         |
                   +--------------------+--------------------+
                                        |
                                        v
                 [Encrypted Package Uploaded to Server]
                 - `encrypted_payload`: Ciphertext
                 - `encrypted_data_key`: Wrapped DEK
                 - `initialization_vector`: 96-bit IV
                 - `authentication_tag`: 128-bit MAC
                 - `attestation_signature`: Client Ed25519

```

### Mathematical Parameters for Cryptographic Primitives

1. **Key Derivation Function (Argon2id):**

$$\text{MasterKEK} = \text{Argon2id}(\text{PIN} = P, \text{Salt} = S, \text{Iterations} = 3, \text{Memory} = 64\text{ MB}, \text{Parallelism} = 1, \text{KeyLen} = 32\text{ bytes})$$


2. **Authenticated Symmetric Encryption:**

$$C, T = \text{AES-GCM-256}(\text{Key} = \text{DEK}, \text{IV} = \text{IV}_{96}, \text{Plaintext} = M, \text{AAD} = \text{RecordMetadata})$$


3. **Key Encapsulation:**

$$\text{WrappedDEK} = \text{AES-GCM-256}(\text{Key} = \text{MasterKEK}, \text{IV} = \text{IV}_{96}, \text{Plaintext} = \text{DEK})$$



---

## 4.1 Granular Transfer Handshake (ECDH + PIN Wrapping)

```
[Alice: FamilyHealth Mobile App]                             [Doctor: Browser Terminal]
               |                                                         |
               | 1. Selects Records [R1, R2]                             |
               | 2. Prompts 4-digit Transfer PIN (e.g. 7492)             |
               | 3. Computes: K_transfer = Argon2id(PIN, Salt)           |
               | 4. Re-wraps DEK_1, DEK_2 with K_transfer                |
               | 5. Uploads Transfer Manifest                            |
               | -----------------------------------------------------> |
               |    [POST /api/v1/transfers]                             |
               |    Returns: Transfer_Token (UUIDv4)                     |
               |                                                         |
               | 6. Alice gives Doctor: URL + 4-digit PIN               |
               | -----------------------------------------------------> |
               |                                                         |
               |                                                         | 7. Doctor opens URL
               |                                                         | 8. Prompts for PIN
               |                                                         | 9. GET /api/v1/transfers/:id
               |                                                         | <---------------------------
               |                                                         | 10. Downloads Ciphertexts
               |                                                         | 11. Computes K_transfer
               |                                                         | 12. Unwraps DEKs in WebAssembly
               |                                                         | 13. Decrypts R1, R2 on screen
               |                                                         |
               | 14. Revoke Action (Atomic)                              |
               | --------------------------------------\                 |
               | [DELETE /api/v1/transfers/:id]         \                |
               | -> Server deletes PIN Salt & Hash       \               |
               | -> Invalidate Redis Cache Entry          \              |
               |                                           +-----------> | 15. Instant Access Terminated

```

---

# 5. Delta-Synchronization Engine Specification

The synchronization protocol handles data transmission over intermittent connections using Lamport vector clocks and an atomic reconciliation engine.

```
 [Client Local State]                                              [Cloud Run Sync Engine]
  Clock: V_client                                                   Clock: V_server
  Outbox: [M_1, M_2]                                                PostgreSQL Sync Log
           |                                                                 |
           | 1. POST /api/v1/sync                                            |
           |    Headers: { X-Device-Clock: V_client }                        |
           |    Body: { Mutations: [M_1, M_2] }                              |
           | --------------------------------------------------------------> |
           |                                                                 |
           |                                                                 | 2. Transaction Open
           |                                                                 | 3. Reconcile Mutations:
           |                                                                 |    FOR EACH M in Mutations:
           |                                                                 |      IF M.provenance == OFFICIAL:
           |                                                                 |        Enforce Signature Verify
           |                                                                 |      UPSERT to health_records
           |                                                                 |      V_server = V_server + 1
           |                                                                 | 4. Fetch Deltas:
           |                                                                 |    SELECT * FROM health_records
           |                                                                 |    WHERE family_id = F_ID
           |                                                                 |      AND sync_version > V_client
           |                                                                 | 5. Commit Transaction
           |                                                                 |
           | 6. HTTP 200 OK                                                  |
           |    Body: { ServerClock: V_server, InboundDeltas: [D_1, D_2] }   |
           | <-------------------------------------------------------------- |
           |                                                                 |
           | 7. Write [D_1, D_2] to local SQLCipher                          |
           | 8. Delete [M_1, M_2] from local_sync_mutation_queue             |
           | 9. Update local clock: V_client = ServerClock                   |
           v                                                                 v

```

---

# 6. Complete API Endpoint Specifications

All endpoints use Protocol Buffers (`Content-Type: application/x-protobuf`) or compact JSON over HTTP/3. Authentication requires a short-lived RS256 Bearer JWT.

### 6.1 Authentication & Circle Management

* `POST /api/v1/auth/otp/issue`
* **Payload:** `{"phone_number": "+2348031122334", "channel": "WHATSAPP_PREF_SMS_FALLBACK"}`
* **Response (200):** `{"challenge_id": "c1f3014a-8105-4c07", "expires_in_sec": 300}`


* `POST /api/v1/auth/otp/verify`
* **Payload:** `{"challenge_id": "c1f3014a-8105-4c07", "otp_code": "849201"}`
* **Response (200):** `{"access_token": "ey...", "refresh_token": "ey...", "family_id": "8b5a7a72..."}`


* `GET /api/v1/families/{family_id}/lineage`
* **Response (200):** Array of all family nodes, pedigree links (`father_id`, `mother_id`), blood profile flags, and overdue alert states.



### 6.2 Dual-Tier Records & Delta Engine

* `POST /api/v1/sync`
* **Headers:** `X-Device-Clock: 140`
* **Payload:**
```json
{
  "mutations": [
    {
      "mutation_id": "e4b1c2a0-4a8d-4e9b-9c3f-7e2a1b0c9d8e",
      "entity_table": "health_records",
      "entity_id": "5e7c89f0-2134-4b56-8a90-1c2d3e4f5a6b",
      "operation": "INSERT",
      "payload": {
        "member_id": "c1f3014a-8105-4c07-ba71-a47f4f5a3e11",
        "provenance": "SELF_REPORTED",
        "category": "VITALS_LOG",
        "title": "Blood Pressure Check",
        "recorded_date": "2026-10-03T07:15:00Z",
        "encrypted_payload": "a1b2c3d4...",
        "encrypted_data_key": "e5f6a7b8...",
        "initialization_vector": "123456789012",
        "authentication_tag": "abcdef0123456789"
      }
    }
  ]
}

```


* **Response (200):**
```json
{
  "server_clock": 142,
  "inbound_deltas": []
}

```





### 6.3 Granular Transfer Management

* `POST /api/v1/transfers`
* **Payload:**
```json
{
  "family_id": "8b5a7a72-7f3e-4d43-9821-6bc2299d4531",
  "issued_by_member_id": "c1f3014a-8105-4c07-ba71-a47f4f5a3e11",
  "recipient_descriptor": "Dr. Babatunde - First Cardiology",
  "pin_salt": "9f8a7b6c5d4e3f2a1b0c9e8d7c6b5a4f",
  "pin_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "ephemeral_public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjAN...",
  "accessible_record_ids": [
    "5e7c89f0-2134-4b56-8a90-1c2d3e4f5a6b"
  ],
  "ttl_seconds": 172800
}

```


* **Response (201):**
```json
{
  "transfer_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "access_url": "https://share.familyhealth.africa/t/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "expires_at": "2026-10-05T07:15:00Z"
}

```




* `DELETE /api/v1/transfers/{transfer_id}`
* **Response (200):** `{"status": "REVOKED", "revoked_at": "2026-10-03T14:40:12Z"}`



### 6.4 Care Navigation & Geospatial Facilities

* `GET /api/v1/facilities/nearby?latitude=6.5244&longitude=3.3792&radius_meters=5000&facility_type=PHARMACY`
* **Response (200):** Array of verified facilities with distance calculations, opening hours, emergency status, and phone numbers.



---

# 7. Edge Deployment Architecture (GCP Topology)

```
                            [Public Mobile Clients]
                                       |
                 UDP/443 (QUIC / HTTP/3) / TLS 1.3 Strict
                                       v
         +------------------------------------------------------------+
         |     Google Cloud Edge PoP (Lagos, NG & JNB, SA)            |
         |  - Anycast IP Ingress                                      |
         |  - Cloud Armor WAF (Layer 7 Filtering & Rate Throttling)   |
         |  - Edge SSL Termination & Brotli Engine                    |
         +------------------------------------------------------------+
                                       |
                   Dedicated Google Global Network Backbone
                                       |
                                       v
         +------------------------------------------------------------+
         | Regional VPC: africa-south1 (Primary) / europe-west3 (Sec) |
         |                                                            |
         |  [Global External Application Load Balancer]               |
         |                             |                              |
         |         +-------------------+-------------------+          |
         |         |                                       |          |
         |         v (Serverless NEG)                      v          |
         |  [Cloud Run Service]                   [Cloud Run Service] |
         |  (Core API & Sync)                     (Transfer Engine)   |
         |  Min: 2 Warm Instances                 Auto-scale: 0-10    |
         |         |                                       |          |
         |         +-------------------+-------------------+          |
         |                             |                              |
         |               (Direct VPC Egress Connector)                |
         |                             |                              |
         |         +-------------------+-------------------+          |
         |         |                                       |          |
         |         v                                       v          |
         |  [Memorystore Redis]                   [Cloud SQL Primary] |
         |  - L2 Delta Cache                      PostgreSQL 16 HA    |
         |  - Bloom Filters                       - CMEK (KMS)        |
         |  - Session Revocations                 - PgBouncer Pool    |
         |                                                 |          |
         |                                                 v (Sync)   |
         |                                        [Cloud SQL Standby] |
         |                                        Cross-Zone Replica  |
         +------------------------------------------------------------+

```

### Edge Caching and Load Balancer Directives

* **Cache Headers for Static/Semi-Static Content:** `Cache-Control: public, max-age=86400, stale-while-revalidate=3600` (Applied to facility directories, localization dictionary bundles, vaccine milestone reference schemas).
* **Zero-Cache Directives for Protected PHI:** `Cache-Control: no-store, no-cache, private, must-revalidate` (Applied to `/api/v1/sync`, `/api/v1/transfers/*`, and all record retrieval endpoints).

---

# 8. Operational Failure Modes & Mitigation Strategies

```
+------------------------------------+----------------------------------------+-------------------------------------------+
| Failure Mode / Edge Event          | Primary Risk Effect                    | Automated Mitigation Strategy             |
+------------------------------------+----------------------------------------+-------------------------------------------+
| Complete Telecommunications Cut    | Mobile app unable to reach GCP edge    | Client switches fully to offline          |
| (Subsea cable cuts, fiber severed) | nodes; API endpoints drop connection.  | SQLCipher storage. Emergency QR code      |
|                                    |                                        | renders from local flash via CBOR format; |
|                                    |                                        | mutations append to sync queue.           |
+------------------------------------+----------------------------------------+-------------------------------------------+
| Multi-Device Concurrent Update     | Family member A updates child allergy  | Reconciled at server boundary via Lamport |
| (Distributed Race Condition)       | on 2G while member B updates on Wi-Fi; | Timestamps and Field-Level Last-Write-    |
|                                    | potential inconsistent tree states.    | Wins (LWW). Official verified records     |
|                                    |                                        | strictly overwrite self-reported updates. |
+------------------------------------+----------------------------------------+-------------------------------------------+
| Database Zone Outage               | Primary Cloud SQL zone in              | Cloud SQL HA performs automated, health-  |
| (Infrastructure Disruption)        | africa-south1-a becomes unresponsive.  | check triggered failover to synchronous   |
|                                    |                                        | standby replica in zone b (< 60s cutover);|
|                                    |                                        | PgBouncer handles client reconnection.    |
+------------------------------------+----------------------------------------+-------------------------------------------+
| Malicious Brute-Force on Shared    | Attacker scans 4-digit PIN space to    | Cloud Armor initiates rate ban after      |
| Transfer URL                       | compromise shared clinical record.     | 5 invalid attempts per source IP; token   |
|                                    |                                        | is locked and invalidation flag set       |
|                                    |                                        | in Redis cache cluster.                   |
+------------------------------------+----------------------------------------+-------------------------------------------+

```

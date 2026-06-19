# FireNavi v4.0 Implementation Roadmap

**Status**: Design Complete → Implementation Phase  
**Duration**: 36 weeks (Q4 2026 ~ Q3 2027)  
**Total Effort**: ~450 person-weeks  
**Team**: Core 5 (backend) + 3 (AI/ML) + 2 (frontend) = 10 FTE

---

## Overview: 4 Phases

```
Phase α (Q4 2026)      Phase β (Q1 2027)       Phase γ (Q2 2027)       Phase δ (Q3 2027+)
─────────────────      ─────────────────       ─────────────────       ─────────────────
Ontology Design        AI Automation           Facility Expansion      Production Launch
Week 1-8               Week 9-20               Week 21-32              Week 33+

• Neo4j Setup          • LSTM Sensor Filter    • Hospital Template      • Pilot Sites (3)
• A* Integration       • ML Response Correct   • Building 50F+          • Patents Filed
• LLM Routing          • Risk Simulation       • Subway/Airport         • Insurance Partners
• Hospital/Hotel       • Uncertainty Quantify  • Template Automation    • Regulatory Approval
```

---

## PHASE α: Ontology Design Foundation (Q4 2026, 8 weeks)

### Week 1-2: Neo4j Knowledge Graph Infrastructure

**Goal**: Set up ontology persistence and queryable knowledge base

**Tasks**:
- [ ] Neo4j cluster setup (prod: 3-node, dev: single)
- [ ] Ontology schema migration (27 nodes + 35 relationships)
- [ ] Sample data loading (1000 facilities across 7 types)
- [ ] Validation pipeline (AXOS 8-node + 9-relationship checklist)
- [ ] Cypher query testing
- [ ] Performance benchmarking (< 50ms query latency target)

**Deliverables**:
- Neo4j production instance
- 100+ example queries (matching ontology)
- Ontology validation framework
- Sample data SQL exports

**Team**: 2 backend engineers  
**Estimation**: 80 hours

**Success Criteria**:
- All 27 node types instantiated
- All 35 relationships queryable
- Query response time < 50ms (p99)
- Data integrity test suite passing

---

### Week 3-4: Route Calculation Engine Redesign

**Goal**: Integrate ontology constraints into A* pathfinding

**Current Code Impact**:
- File: `lab/route-optimizer.html` (2028 lines)
- Function: `calculateOptimalRoute()` → decompose into:
  1. `fetchOntologyConstraints()` (Neo4j query)
  2. `applyPersonalizedScoring()` (weighted calculation)
  3. `runAStarWithConstraints()` (pathfinding)

**Tasks**:
- [ ] Refactor route calculation into 3 microservices
- [ ] Ontology constraint fetching (Neo4j)
  - Query: "Find all constraints for Person_Wheelchair"
  - Result: [{rule: "EXCLUDE_STAIRS", weight: ∞}, ...]
- [ ] Personalized scoring formula implementation
  ```
  score = distance×D_w + time×T_w + smoke×(1+respiratory_sens×3)
          + crowd×crowd_sens + stair_penalty + guardian_dist
          + future_hazard + safety_margin_alpha
  ```
- [ ] A* pathfinding with dynamic weight maps
- [ ] 60-second future hazard prediction integration
- [ ] Unit tests (50+ test cases)
- [ ] Load testing (1000 concurrent route requests)

**Deliverables**:
- Route calculation microservice (Node.js)
- Scoring formula test suite
- Performance benchmarks
- 60-second prediction accuracy metrics

**Team**: 2 backend engineers + 1 AI engineer  
**Estimation**: 120 hours

**Success Criteria**:
- Route recalculation latency < 500ms (p99)
- All 10 person types handled correctly
- 60-second prediction RMSE < 15%
- Zero invalid route generation (no wheelchair→stairs)

---

### Week 5-6: Explainable Routing with LLM

**Goal**: Implement Claude API-based explanation generation

**Tasks**:
- [ ] Claude API integration (Anthropic SDK)
  ```javascript
  const explanation = await anthropic.messages.create({
    model: "claude-opus-4-8",
    messages: [{
      role: "user",
      content: `User is wheelchair. Fire at stairs (0.85 smoke). 
               Elevator crowded (0.6). Ramp clear (0.15 smoke).
               Generate natural language explanation for ramp choice.`
    }],
    max_tokens: 500
  });
  ```
- [ ] Decision trace logging (capture ontology reasoning)
- [ ] Explanation caching (Redis, TTL 60s)
- [ ] Multi-language support (auto-detect from device OS)
- [ ] Confidence scoring (0-1 scale)
- [ ] Uncertainty quantification
- [ ] A/B testing framework

**Deliverables**:
- LLM explanation microservice
- Decision trace logger
- Multi-language prompt templates
- User study results (comprehension, trust, clarity)

**Team**: 1 backend + 1 AI engineer  
**Estimation**: 100 hours

**Success Criteria**:
- Explanation latency < 2s (p99)
- User comprehension score > 4/5
- Trust increase vs v3.0: > 25%
- All 12 languages fluent
- Uncertainty correctly expressed

---

### Week 7-8: Hospital & Hotel Ontology Templates

**Goal**: Create facility-type specific ontology extensions

**Hospital Template**:
```json
{
  "additional_person_types": [
    "bedridden_patient",
    "oxygen_dependent",
    "cognitive_impaired",
    "icu_post_op"
  ],
  "additional_spaces": [
    "icu", "surgery_room", "isolation_ward", "emergency_elevator"
  ],
  "special_hazards": [
    "equipment_dependency",
    "medical_evacuation_complexity"
  ],
  "constraint_overrides": {
    "bedridden_patient": "self_evacuation=false, require_rescue=true"
  }
}
```

**Hotel Template**:
```json
{
  "additional_person_types": [
    "international_guest",
    "family_with_kids",
    "elderly_tourist"
  ],
  "language_handling": "auto_detect_from_device_os",
  "constraint_additions": {
    "international_guest": "prefer_visual_guidance"
  }
}
```

**Tasks**:
- [ ] Hospital ontology design (8h domain research + interviews)
- [ ] Hotel ontology design
- [ ] School ontology template
- [ ] Subway/transit ontology template
- [ ] Template instantiation pipeline
- [ ] Constraint conflict resolution
- [ ] Pilot facility mapping (1 hospital, 1 hotel)

**Deliverables**:
- 4 facility-type ontology templates (JSON)
- Constraint conflict resolution engine
- Pilot facility floor plans + space graphs
- Template application framework

**Team**: 1 architect + 1 domain expert  
**Estimation**: 100 hours

**Success Criteria**:
- All 4 templates complete and validated
- Hospital template tested with 50-bed sample
- Hotel template tested with 500-room sample
- Template reuse > 80% (code/concept)

---

## PHASE β: AI Automation & Sensor Optimization (Q1 2027, 12 weeks)

### Week 9-12: LSTM-Based Sensor Noise Filtering

**Goal**: Improve sensor accuracy using deep learning

**Current Challenge**:
- Accelerometer noise causes false "falling" alerts
- Microphone noise causes false "alarm" detection
- Barometer jitter causes floor change false positives

**LSTM Approach**:
```python
model = LSTM(
  input: (time_window=10, features=7),  # 10 sensor readings × 7 channels
  hidden: 64,
  output: 7  # clean sensor values
)

# Training data: noisy sensor readings paired with ground truth
# (gathered from historical evacuation drills)
```

**Tasks**:
- [ ] Historical sensor data collection (from v3.0 live deployments)
- [ ] Ground truth labeling (what users actually did)
- [ ] LSTM model architecture design
- [ ] Training pipeline (PyTorch / TensorFlow)
- [ ] Model quantization for mobile (TensorFlow Lite)
- [ ] Accuracy evaluation (p50/p95 latency, < 50ms)
- [ ] Integration into mobile app
- [ ] A/B testing (noisy v.s. filtered)

**Deliverables**:
- Trained LSTM model (.pb, .tflite)
- Training dataset (1000h sensor data, anonymized)
- Mobile integration code
- Accuracy report (sensor RMSE, fall detection F1 score)

**Team**: 2 ML engineers + 1 mobile engineer  
**Estimation**: 160 hours

**Success Criteria**:
- Sensor accuracy improvement: +35%
- Mobile latency < 50ms (TensorFlow Lite)
- Fall detection F1 score > 0.92
- No excessive false positives in live test

---

### Week 13-16: ML-Based Survey Response Correction

**Goal**: Predict missing survey responses using user history

**Problem**:
- Panic → 30% of users don't respond to 3-question survey
- Current fallback: assume "unknown" → limits personalization
- Solution: ML model learns user patterns → fills gaps

**Approach**:
```python
# User historical pattern: given past behavior, 
# what's their likely response to "do you smell fire?"

features = [
  user_person_type,  # wheelchair, elderly, etc.
  time_since_alarm,
  location_floor,
  location_distance_to_exit,
  sensor_readings[accelerometer, microphone, light],
  respiration_pattern,
  nearby_users_responses  # collective signal
]

output = survey_response_probability  # P(q1=true), P(q2=true), P(q3=panic_level)
```

**Tasks**:
- [ ] Feature engineering from sensor data + user history
- [ ] Dataset creation (500K survey responses from v3.0)
- [ ] Model selection (Gradient Boosting / Random Forest)
- [ ] Hyperparameter tuning
- [ ] Cross-validation (k-fold, stratified)
- [ ] Deployment as microservice (FastAPI)
- [ ] Feedback loop: compare predictions v.s. actual responses

**Deliverables**:
- ML model (XGBoost/RF pickle)
- Survey correction microservice
- Prediction confidence scores
- User study results

**Team**: 2 ML engineers  
**Estimation**: 120 hours

**Success Criteria**:
- Prediction accuracy: 70% → 95%
- Recall (actual responders): > 0.85
- Precision (no false responses): > 0.90
- Response time < 100ms

---

### Week 17-20: Future Hazard Prediction (60-second lookahead)

**Goal**: Simulate fire spread + crowd movement to predict 60s future state

**Current Limitation**:
- Route calculation only sees current hazard map
- Doesn't account for "this path becomes blocked in 60s"
- Solution: Run fast simulation 60s forward

**Physics Model**:
```
Smoke Spread:
  dSmoke/dt = dispersion_rate × (source_smoke - ambient_smoke)
                - ventilation_removal
                + wind_effect
  
  Beer-Lambert: visibility = exp(-extinction_coefficient × smoke_depth)

Crowd Movement:
  Position[t+dt] = Position[t] + velocity×dt
  velocity = desired_velocity - crowd_repulsion
  
  Social Force: F = F_desired + F_repulsion + F_friction
```

**Tasks**:
- [ ] Physics model implementation (Python)
- [ ] Smoke spread simulation (from 14 hazard log entries)
- [ ] Crowd movement simulation (from 4000 user trajectories)
- [ ] Real-time execution (< 100ms for 60s prediction)
- [ ] Monte Carlo uncertainty quantification (1000 runs)
- [ ] Integration into route calculation
- [ ] Validation against historical data

**Deliverables**:
- Hazard simulation engine (Python)
- Crowd movement simulator
- Microservice wrapper (FastAPI)
- Prediction accuracy metrics

**Team**: 2 AI/simulation engineers + 1 backend  
**Estimation**: 140 hours

**Success Criteria**:
- Smoke concentration RMSE @ t=60s: < 20%
- Crowd position RMSE @ t=60s: < 5m
- Execution time: < 100ms (p99)
- Monte Carlo runs: 1000 (uncertainty envelope)

---

## PHASE γ: Facility Expansion (Q2 2027, 12 weeks)

### Week 21-24: Hospital Deployment (50-bed pilot)

**Goal**: Adapt v4.0 to real hospital environment

**Domain Challenges**:
- Patient privacy (HIPAA compliance)
- Medical equipment integration (ventilators, monitors)
- ICU vs ward vs surgery room variant evacuation
- Staff-to-patient coordination

**Tasks**:
- [ ] Hospital layout digitization (floor plans → space graph)
- [ ] Patient data integration (bed assignments, mobility status)
- [ ] Staff role definitions (nurse, doctor, orderly)
- [ ] Medical evacuation simulation (stretcher movement time 3× slower)
- [ ] Privacy implementation (location data = room-level only, not bed-level)
- [ ] Integration with hospital SMS/radio alert system
- [ ] Training for hospital staff (2h per person × 100 staff)
- [ ] Live evacuation drill (50 patients + 30 staff)

**Deliverables**:
- Hospital ontology instance (50 beds)
- Space graph (5 floors, 60 rooms)
- HIPAA compliance audit
- Staff training materials + certification

**Team**: 1 architect + 1 domain expert + 1 backend  
**Estimation**: 160 hours

**Success Criteria**:
- All patients assigned to mobility category
- No HIPAA violations in logs
- Drill evacuation time < 12 minutes
- 95%+ staff can operate system

---

### Week 25-28: High-Rise Building (50+ floors)

**Goal**: Handle vertical evacuation complexity

**Challenges**:
- Stairwell bottlenecks (single stair for 4000 people)
- Elevator capacity limits (12 people/cab × 4 cabs = 48/minute)
- Floor numbering (50F = 12,500 people possible)
- Refuge floors (safe zones every 12 floors)
- Roof access (helicopter evacuation option)

**Tasks**:
- [ ] Vertical space graph modeling
- [ ] Stairwell capacity constraints (width 1.5m → max 1 person/sec)
- [ ] Elevator load balancing (distribute users across 4 shafts)
- [ ] Refuge floor logic ("wait here if blocked below")
- [ ] Roof evacuation option (helicopter priority)
- [ ] Time-zone aware guidance (don't all go down simultaneously)
- [ ] Simulation on real 50F building layout

**Deliverables**:
- High-rise building ontology
- Vertical evacuation algorithm
- Capacity constraint engine
- Simulation results (evacuation time vs occupancy)

**Team**: 1 architect + 2 backend engineers  
**Estimation**: 160 hours

**Success Criteria**:
- Stairwell utilization > 80% (no idle time)
- Evacuation time ≤ 25 min for full building
- Refuge floor safety margins respected
- Zero path invalid (no helicopter without roof access)

---

### Week 29-32: Subway & Airport (High Density)

**Goal**: Handle very large, linear evacuation networks

**Subway Challenge**:
- 80,000 passengers × 20 platforms = 4000 per platform
- Tunnel structure (no side exits for 500m stretches)
- Emergency stairs every 100m
- Track electrification hazard (3rd rail)

**Airport Challenge**:
- 60,000 passengers × 100+ gates
- Security zones (restricted access)
- Baggage system (alternative routing?)
- International passenger communication (30+ languages)

**Tasks**:
- [ ] Subway space graph (linear tunnel + stations)
- [ ] Emergency stair placement logic
- [ ] 3rd rail hazard mapping
- [ ] Airport gate + security zone modeling
- [ ] Baggage claim area evacuation
- [ ] Multilingual guidance (auto-detect phone OS language)
- [ ] Mass notification system integration (SMS, PA system)
- [ ] Simulation: 80K people evacuating in 30 min?

**Deliverables**:
- Subway ontology (sample: 20 stations)
- Airport ontology (sample: 50 gates)
- High-density constraint solver
- Multilingual notification templates (30+ languages)

**Team**: 1 architect + 2 backend engineers + 1 localization specialist  
**Estimation**: 200 hours

**Success Criteria**:
- Subway 80K evacuation modeled
- Airport 60K evacuation modeled
- Multilingual guidance tested with native speakers
- Bottleneck prediction accuracy > 90%

---

## PHASE δ: Patent & Market Launch (Q3 2027+, ongoing)

### Week 33-36: Patent Filing & Market Prep

**Goal**: Protect IP + prepare commercial deployment

**Patent 1: Ontology-Based Route**
```
Filing: "System and method for ontology-based personalized 
         evacuation routing with explainable AI"
Claims: 
  1. Ontology with 16 person types + 9 relationship types
  2. Constraint-driven A* pathfinding
  3. LLM-based explanation generation
Prior Art Search: Already done (clear field)
Status: Ready to file
```

**Patent 2: Constraint Automation**
```
Filing: "Method for automatic safety margin adjustment based 
         on individual accessibility constraints"
Claims:
  1. Wheelchair → safety_margin_alpha = 2.0 (automatic)
  2. Respiratory disease → smoke_sensitivity = 3.0
  3. Child → guardian_sync required
Prior Art: None found (novel approach)
Status: Ready to file
```

**Patent 3: Sensor Normalization**
```
Filing: "Ontology-based normalization of heterogeneous 
         disaster sensor data for risk map generation"
Claims:
  1. Multi-source sensor fusion (audio, IMU, barometer)
  2. Bayesian confidence weighting
  3. 56× data density vs traditional IoT
Status: Ready to file
```

**Patent 4: Decision Tracing**
```
Filing: "Transparent AI decision-making through ontology-based 
         reasoning trace generation"
Claims:
  1. Capture ontology relationship path for each decision
  2. Auto-generate natural language justification
  3. Quantify confidence + uncertainty
Status: Ready to file
```

**Tasks**:
- [ ] Patent application drafting (with IP counsel)
- [ ] Prior art searches (USPTO, Google Patents, WIPO)
- [ ] Claims optimization (maximize coverage, minimize risk)
- [ ] Filing with USPTO, EPO, KIPO (Korea), JPTO (Japan)
- [ ] Provisional filings (faster, lower cost)
- [ ] Continuation strategy (file improvements as follow-ups)

**Deliverables**:
- 4 patent applications filed
- Claim scope analysis
- Competitive landscape map
- Freedom-to-operate assessment

**Team**: 2 engineers + 1 patent attorney  
**Estimation**: 120 hours (legal hours separate)

**Success Criteria**:
- 4 patent applications filed within 2 weeks
- Claims cover ontology novelty (not just AI)
- Claims survive initial USPTO office action

---

### Week 33+: Pilot Deployments & Revenue

**Hospital Pilot (Q3 2027)**
- Partner: 1-2 major tertiary hospitals
- Users: 200-500 patients + staff
- Duration: 3 months
- Goal: Prove 40% reduction in evacuation time

**Insurance Partnership (Q4 2027)**
- Partner: Major P&C insurer
- Value Prop: Lower liability via documented safety
- Revenue Model: Per-bed licensing + data access
- Potential: $100K-500K per hospital per year

**Cruise Industry (2028)**
- Target: 10 cruise ships within 18 months
- Revenue per ship: $250K-500K
- Market: ~150 major cruise ships globally = $40M TAM

**Hotel/Hospitality (2028)**
- Target: 100 5-star hotels
- Revenue model: SaaS per facility (suite included)
- Potential: $50M TAM

---

## Resource Allocation

### Team Structure (10 FTE)

**Backend (5 people)**
- 1 Architect (ontology design, API design)
- 2 Senior Backend Engineers (microservices, databases)
- 2 Junior Backend Engineers (API implementation, testing)

**AI/ML (3 people)**
- 1 Senior ML Engineer (model design, research)
- 2 ML Engineers (implementation, validation)

**Frontend/Mobile (2 people)**
- 1 iOS/Android Engineer
- 1 Web Engineer (admin dashboards)

**DevOps / QA (shared)**
- Infrastructure maintained by cloud provider (Vercel/Firebase)
- QA integrated into CI/CD (automated testing)

---

## Budget Estimate

| Category | Q4 2026 | Q1 2027 | Q2 2027 | Q3 2027 | Total |
|----------|---------|---------|---------|---------|--------|
| Salaries | $150K | $150K | $150K | $150K | $600K |
| Cloud (AWS/GCP) | $15K | $20K | $25K | $30K | $90K |
| Third-party APIs | $5K | $8K | $10K | $12K | $35K |
| Legal/Patents | $0 | $0 | $0 | $40K | $40K |
| **Total** | **$170K** | **$178K** | **$185K** | **$232K** | **$765K** |

**ROI Analysis**:
- Year 1 (Pilot): -$765K (investment)
- Year 2: +$500K revenue (3 hospitals)
- Year 3: +$2M revenue (10 ships + 20 hotels)
- Payback: ~18 months from first commercial deployment

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| ML model accuracy insufficient | Medium | High | Fallback to v3.0 routing |
| Hospital regulatory delay | Medium | High | Start hotel/cruise pilots in parallel |
| Ontology complexity explosion | Low | High | Modular template approach (facility-type) |
| Patent rejection | Low | Medium | Broader claims + continuation filings |
| Sensor drift (WiFi changes) | High | Low | Recalibration procedure + edge detection |

---

## Success Metrics (Phase Completion)

**Phase α (Week 8)**:
- ✅ Neo4j queryable (< 50ms)
- ✅ Route calculation latency < 500ms
- ✅ LLM explanation latency < 2s
- ✅ Hospital + hotel templates ready

**Phase β (Week 20)**:
- ✅ Sensor accuracy +35%
- ✅ Survey response prediction > 95%
- ✅ Future hazard prediction RMSE < 20%

**Phase γ (Week 32)**:
- ✅ Hospital pilot evacuation time < 12 min
- ✅ High-rise 50F evacuation < 25 min
- ✅ Subway 80K evacuation modeled
- ✅ Airport 60K evacuation modeled

**Phase δ (Week 36+)**:
- ✅ 4 patents filed
- ✅ Hospital partnership signed
- ✅ Insurance partnership in negotiation
- ✅ Cruise ship pilot approved

---

**Next Step**: 
Allocate team resources, set up development environments, and kick off Phase α Week 1 tasks.

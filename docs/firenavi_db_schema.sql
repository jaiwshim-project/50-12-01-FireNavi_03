-- FireNavi v4.0 Database Schema (PostgreSQL)
-- 온톨로지 기반 개인맞춤 대피 경로 시스템

-- ==================== USERS & PROFILES ====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id VARCHAR(255) UNIQUE NOT NULL,
  device_type VARCHAR(50),
  os_type VARCHAR(50),
  os_language VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP,
  last_location POINT,
  last_location_timestamp TIMESTAMP,
  is_responder BOOLEAN DEFAULT FALSE,
  is_test_user BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  facility_id UUID,  -- current facility (NULL if not in facility)
  person_type VARCHAR(100) NOT NULL,
    -- options: general|elderly|child|wheelchair|respiratory_disease|
    --          hearing_impaired|vision_impaired|bedridden|pregnant|foreigner
  mobility_speed FLOAT DEFAULT 1.4,
  safety_margin_alpha FLOAT DEFAULT 1.0,
  preferred_guidance_channels TEXT[] DEFAULT ARRAY['visual','voice'],
  is_guardian BOOLEAN DEFAULT FALSE,
  guardian_user_id UUID REFERENCES users(id),
  can_climb_stairs BOOLEAN DEFAULT TRUE,
  can_use_elevator BOOLEAN DEFAULT TRUE,
  can_use_ramp BOOLEAN DEFAULT TRUE,
  cognitive_impairment BOOLEAN DEFAULT FALSE,
  hearing_level VARCHAR(50),  -- normal|hard_of_hearing|deaf
  vision_level VARCHAR(50),   -- normal|low_vision|blind
  oxygen_dependency BOOLEAN DEFAULT FALSE,
  requires_rescue BOOLEAN DEFAULT FALSE,
  medical_conditions TEXT[],
  allergies TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, facility_id)
);

-- ==================== FACILITIES & SPACES ====================

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  facility_type VARCHAR(100) NOT NULL,
    -- options: cruise|hospital|hotel|building|school|subway|airport|stadium
  address VARCHAR(500),
  country VARCHAR(100),
  region VARCHAR(100),
  capacity INT,
  floor_count INT,
  floor_height FLOAT,
  total_area_m2 FLOAT,
  wifi_ssid VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  fire_department_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  space_type VARCHAR(100) NOT NULL,
    -- options: corridor|room|staircase|emergency_staircase|elevator|
    --          emergency_elevator|exit|emergency_exit|safe_zone|ramp|
    --          firebreak_door|icu|surgery_room|isolation_ward|lobbby|
    --          parking|platform|tunnel|refuge_floor
  name VARCHAR(255),
  floor INT,
  section VARCHAR(50),
  coords POLYGON,
  capacity INT,
  accessibility_features TEXT[],
  connected_space_ids UUID[],
  risk_baseline_fire FLOAT DEFAULT 0.0,
  risk_baseline_smoke FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spaces_facility ON spaces(facility_id);
CREATE INDEX idx_spaces_floor ON spaces(floor);
CREATE INDEX idx_spaces_type ON spaces(space_type);

CREATE TABLE space_semantics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  semantic_role VARCHAR(100),
    -- options: primary_route|alternative_route|shelter|bottleneck|
    --          firebreak|evacuation_concentration|responder_staging|
    --          equipment_storage
  importance_score FLOAT,
  is_exit BOOLEAN DEFAULT FALSE,
  is_emergency_exit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_space_semantics_space ON space_semantics(space_id);

-- ==================== SENSORS & HAZARDS ====================

CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 7 sensor channels
  accelerometer_x FLOAT,
  accelerometer_y FLOAT,
  accelerometer_z FLOAT,
  microphone_db FLOAT,
  barometer_pa FLOAT,
  light_lux FLOAT,
  magnetometer_heading FLOAT,
  wifi_rssi INT,

  -- derived states
  is_moving BOOLEAN,
  is_breathing_abnormal BOOLEAN,
  is_falling BOOLEAN,
  estimated_floor INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sensor_readings_user_time ON sensor_readings(user_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_facility_time ON sensor_readings(facility_id, timestamp DESC);

CREATE TABLE hazard_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hazard_type VARCHAR(100) NOT NULL,
    -- options: fire|smoke|electrical|structural|crowd_crush|
    --          equipment_failure|power_outage|exit_blocked|
    --          elevator_malfunction|flooding|toxic_gas
  severity_score FLOAT NOT NULL CHECK (severity_score >= 0 AND severity_score <= 1),
  location POINT,
  spread_velocity FLOAT,
  source VARCHAR(255),
  detected_by VARCHAR(50),  -- sensor|user_report|responder|automatic
  confidence FLOAT,
  prediction_60s JSONB,  -- {smoke: 0.8, fire: 0.3, crowd: 0.7}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hazard_log_facility_time ON hazard_log(facility_id, timestamp DESC);
CREATE INDEX idx_hazard_log_type ON hazard_log(hazard_type);

-- ==================== RISK MAP CACHE ====================

CREATE TABLE risk_map_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  snapshot JSONB NOT NULL,
    -- structure: {
    --   [space_id]: {
    --     fire: 0.1,
    --     smoke: 0.3,
    --     crowd: 0.5,
    --     structural: 0.0,
    --     electrical: 0.0
    --   }
    -- }
  source VARCHAR(50),  -- bayesian_fusion|model_prediction|hybrid
  version INT,
  ttl_seconds INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_map_snapshots_facility_time ON risk_map_snapshots(facility_id, timestamp DESC);

-- ==================== ROUTES ====================

CREATE TABLE route_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  route_type VARCHAR(100) NOT NULL,
    -- options: primary|alternative|vulnerable_priority|responder_approach|shelter_in_place

  path_node_ids UUID[],
  path_directions JSONB,  -- [{from_space, to_space, direction_description}]

  total_distance_m FLOAT,
  eta_seconds INT,
  estimated_congestion_count INT,

  risk_score_fire FLOAT,
  risk_score_smoke FLOAT,
  risk_score_crowd FLOAT,
  risk_score_total FLOAT,

  constraints_applied TEXT[],
  barriers_encountered TEXT[],

  accessibility_level VARCHAR(50),  -- full|wheelchair|visual|hearing

  generated_by VARCHAR(50),  -- algorithm|ai|responder|manual
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  is_optimal BOOLEAN DEFAULT FALSE,
  is_alternative BOOLEAN DEFAULT FALSE,
  is_backup BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_route_candidates_user_facility ON route_candidates(user_id, facility_id, timestamp DESC);

-- ==================== DECISION RATIONALE ====================

CREATE TABLE decision_rationale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES route_candidates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- ontology trace
  ontology_trace JSONB,
    -- [{
    --   step: "person_wheelchair",
    --   rule: "EXCLUDE_STAIRS",
    --   weight: "INF",
    --   reason: "신체적으로 불가능"
    -- }]

  -- LLM-generated explanation
  explanation_text TEXT,
  explanation_summary VARCHAR(500),
  explanation_language VARCHAR(10),

  -- decision factors
  decision_factors JSONB,
    -- {
    --   "smoke_level_at_stair": 0.85,
    --   "crowd_density_at_exit_b": 0.6,
    --   "user_constraint": "wheelchair",
    --   "guardian_distance_m": 45.2,
    --   "applied_safety_margin": 2.0,
    --   "future_hazard_score_60s": 0.75
    -- }

  confidence_score FLOAT,
  uncertainty_factors TEXT[],

  alternative_routes_rejected JSONB,
    -- [{route_id, reason}]

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decision_rationale_route ON decision_rationale(route_id);
CREATE INDEX idx_decision_rationale_user ON decision_rationale(user_id);

-- ==================== SURVEYS & USER INPUTS ====================

CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  question_1_smell_fire BOOLEAN,
  question_2_see_smoke BOOLEAN,
  question_3_panic_level INT CHECK (question_3_panic_level >= 0 AND question_3_panic_level <= 10),

  response_confidence FLOAT,
  response_latency_ms INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_survey_responses_user_time ON survey_responses(user_id, timestamp DESC);

-- ==================== EVACUATION EVENTS ====================

CREATE TABLE evacuation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,

  event_type VARCHAR(100) NOT NULL,  -- fire_alarm|drill|real_incident|test
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,

  trigger_source VARCHAR(100),  -- alarm_audio|manual_activation|sensor_detection
  confirmed_by VARCHAR(100),  -- responder|manual|system

  total_users_in_facility INT,
  total_users_alerted INT,
  total_users_evacuated INT,

  casualties INT DEFAULT 0,
  trapped_users INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evacuation_events_facility_time ON evacuation_events(facility_id, start_time DESC);

-- ==================== RESPONDER ASSIGNMENTS ====================

CREATE TABLE responder_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evacuation_event_id UUID NOT NULL REFERENCES evacuation_events(id) ON DELETE CASCADE,
  responder_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  assigned_to_space_id UUID REFERENCES spaces(id),
  assignment_type VARCHAR(100),  -- search_and_rescue|crowd_control|medical|equipment

  status VARCHAR(50),  -- assigned|in_progress|completed|standby

  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== AUDIT LOG ====================

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100),
  user_id UUID REFERENCES users(id),
  facility_id UUID REFERENCES facilities(id),
  action VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_time ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- ==================== ONTOLOGY RULES (REFERENCE) ====================

CREATE TABLE ontology_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL,
  ontology_from_node VARCHAR(255),
  ontology_to_node VARCHAR(255),
  rule_type VARCHAR(100),  -- constraint|preference|trigger|decision

  rule_condition VARCHAR(500),
  rule_action VARCHAR(500),

  weight FLOAT,
  is_blocking BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  applies_to_person_types TEXT[],

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample rule data
INSERT INTO ontology_rules
(rule_name, ontology_from_node, ontology_to_node, rule_type, rule_condition, rule_action, weight, is_blocking)
VALUES
('wheelchair_exclude_stairs', 'Person_Wheelchair', 'Route_Calculation', 'constraint', 'person_type = wheelchair', 'exclude_stairs', 999999, TRUE),
('respiratory_avoid_smoke', 'Person_Respiratory_Disease', 'Route_Calculation', 'constraint', 'has_respiratory_disease = true', 'apply_smoke_sensitivity_3x', 999999, TRUE),
('child_sync_guardian', 'Person_Child', 'Route_Calculation', 'preference', 'person_type = child', 'sync_with_guardian_location', 10, FALSE),
('hearing_impaired_visual_guidance', 'Person_Hearing_Impaired', 'Path_Explanation_Generation', 'preference', 'hearing_level = deaf', 'output_visual_vibration', 12, FALSE),
('vision_impaired_voice_guidance', 'Person_Vision_Impaired', 'Path_Explanation_Generation', 'preference', 'vision_level = blind', 'output_voice_vibration', 12, FALSE);

-- ==================== STATISTICS & ANALYTICS ====================

CREATE TABLE evacuation_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  event_id UUID REFERENCES evacuation_events(id),

  metric_name VARCHAR(255),
  metric_value FLOAT,

  person_type VARCHAR(100),

  measurement_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES FOR PERFORMANCE ====================

CREATE INDEX idx_users_phone ON users(phone_id);
CREATE INDEX idx_user_profiles_type ON user_profiles(person_type);
CREATE INDEX idx_facilities_type ON facilities(facility_type);
CREATE INDEX idx_hazard_log_time ON hazard_log(timestamp DESC);

-- ==================== FUNCTIONS ====================

-- Calculate route score based on user constraints
CREATE OR REPLACE FUNCTION calculate_route_score(
  route_id UUID,
  user_id UUID
) RETURNS FLOAT AS $$
DECLARE
  distance_cost FLOAT;
  smoke_cost FLOAT;
  crowd_cost FLOAT;
  constraint_penalty FLOAT;
  safety_margin FLOAT;
  total_score FLOAT;
BEGIN
  -- TODO: Implement scoring logic based on ontology rules
  SELECT 1.0 INTO total_score;
  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Update hazard map in real-time
CREATE OR REPLACE FUNCTION update_hazard_map(
  facility_id UUID,
  new_snapshot JSONB
) RETURNS UUID AS $$
DECLARE
  snapshot_id UUID;
BEGIN
  INSERT INTO risk_map_snapshots (facility_id, snapshot, source, version)
  VALUES (facility_id, new_snapshot, 'bayesian_fusion', 1)
  RETURNING id INTO snapshot_id;
  RETURN snapshot_id;
END;
$$ LANGUAGE plpgsql;

-- ==================== VIEWS ====================

CREATE OR REPLACE VIEW v_active_evacuations AS
SELECT
  ee.id,
  ee.facility_id,
  f.name as facility_name,
  ee.event_type,
  ee.start_time,
  ee.total_users_in_facility,
  ee.total_users_alerted,
  (ee.total_users_in_facility - ee.total_users_evacuated) as users_remaining
FROM evacuation_events ee
JOIN facilities f ON ee.facility_id = f.id
WHERE ee.end_time IS NULL;

CREATE OR REPLACE VIEW v_vulnerable_users_status AS
SELECT
  up.user_id,
  u.phone_id,
  up.facility_id,
  up.person_type,
  rc.id as last_route_id,
  rc.eta_seconds,
  rc.risk_score_total
FROM user_profiles up
JOIN users u ON up.user_id = u.id
LEFT JOIN route_candidates rc ON up.user_id = rc.user_id AND up.facility_id = rc.facility_id
WHERE up.person_type IN ('elderly', 'child', 'wheelchair', 'bedridden', 'respiratory_disease')
AND up.facility_id IS NOT NULL;

-- ==================== GRANTS (if using role-based access) ====================
-- GRANT SELECT ON facility TO app_user;
-- GRANT INSERT, UPDATE ON route_candidates TO app_user;

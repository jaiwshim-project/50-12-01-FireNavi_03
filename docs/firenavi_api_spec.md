# FireNavi v4.0 API Specification

**Version**: 4.0  
**Status**: Design Complete  
**Base URL**: `https://api.firenavi.io/v4`  
**Authentication**: Bearer Token (JWT)

---

## 1. Authentication

### POST /auth/login
**User authentication endpoint**

```json
Request:
{
  "phone_id": "string",
  "device_fingerprint": "string"
}

Response (200):
{
  "access_token": "jwt_token",
  "refresh_token": "string",
  "expires_in": 3600,
  "user_id": "uuid"
}

Response (401):
{
  "error": "INVALID_PHONE_ID",
  "message": "Phone ID not found in system"
}
```

---

## 2. Stage 1: Fire Trigger Detection

### POST /fire/trigger
**Report fire detection (called by control center or automatic)**

```json
Request:
{
  "facility_id": "uuid",
  "trigger_source": "alarm_audio|sensor_detection|manual_activation",
  "timestamp": "2026-05-30T10:00:00Z",
  "audio_pattern_confidence": 0.95
}

Response (200):
{
  "activation_status": "FIRE_ALERT_ACTIVATED",
  "phones_alerted": 4000,
  "event_id": "uuid",
  "facility_name": "Cruise Ship Paradise"
}

Broadcast to all phones:
  WebSocket: event_type="FIRE_ALERT_ACTIVATION"
  Trigger: App shows red alert screen + vibration + alarm
```

---

## 3. Stage 2: Localization (WiFi + IMU)

### POST /localization/update
**Real-time location update (WiFi RSSI + IMU sensors)**

```json
Request:
{
  "user_id": "uuid",
  "facility_id": "uuid",
  "wifi_rssi": [-45, -52, -48],
  "wifi_bssids": ["AA:BB:CC:DD:EE:01", "AA:BB:CC:DD:EE:02", "AA:BB:CC:DD:EE:03"],
  "accelerometer": { "x": 0.1, "y": 0.05, "z": 9.8 },
  "barometer_pa": 101325,
  "gyroscope": { "x": 0.01, "y": 0.02, "z": 0.0 },
  "timestamp": "2026-05-30T10:00:01.500Z"
}

Response (200):
{
  "user_id": "uuid",
  "location": {
    "floor": 5,
    "x": 42.5,
    "y": 18.3,
    "coordinates": "POINT(40.7128 -74.0060)",
    "accuracy_m": 2.1
  },
  "floor_detected": 5,
  "floor_confidence": 0.92
}
```

**Latency Requirement**: < 200ms  
**Update Frequency**: Every 1 second (or when WiFi changes)

---

## 4. Stage 3: Micro Survey

### POST /survey/micro
**Quick 3-question micro survey (3 seconds max)**

```json
Request:
{
  "user_id": "uuid",
  "facility_id": "uuid",
  "q1_smell_fire": true,        // Do you smell fire/burning?
  "q2_see_smoke": false,         // Do you see smoke?
  "q3_panic_level": 6,           // 0-10 panic scale
  "response_time_ms": 2850,
  "timestamp": "2026-05-30T10:00:03Z"
}

Response (200):
{
  "survey_id": "uuid",
  "responses_received": true,
  "confidence": 0.85,
  "user_state_vector": {
    "smell_fire": true,
    "see_smoke": false,
    "panic_level": 6,
    "estimated_hazard_proximity": "close"
  }
}

Response (206 - No Response):
{
  "survey_id": "uuid",
  "responses_received": false,
  "fallback_estimation": true,
  "estimated_from": "sensor_pattern_history",
  "user_state_vector": { "inferred": true }
}
```

**Timeout**: 3 seconds (auto-submit partial response)  
**Accuracy**: 70% response rate expected, 30% fallback estimation

---

## 5. Stage 4: Sensor Fusion

### POST /sensors/batch
**Batch 7-channel sensor data submission**

```json
Request:
{
  "user_id": "uuid",
  "facility_id": "uuid",
  "timestamp": "2026-05-30T10:00:04Z",
  "sensors": {
    "accelerometer": {
      "x": 0.05, "y": 0.02, "z": 9.81,
      "magnitude": 9.815,
      "is_falling": false,
      "is_breathing": true
    },
    "microphone": {
      "db_level": 85,
      "alarm_detected": true,
      "alarm_confidence": 0.98,
      "speech_detected": false
    },
    "barometer": {
      "pressure_pa": 101320,
      "altitude_change_m": 1.2,
      "floor_change": 0
    },
    "light_sensor": {
      "lux": 150,
      "darkness_level": 0.3,
      "smoke_estimated": false
    },
    "magnetometer": {
      "heading_degrees": 45,
      "x": 22000,
      "y": -5000,
      "z": 40000
    },
    "wifi_rssi": {
      "strongest_rssi": -42,
      "strongest_bssid": "AA:BB:CC:DD:EE:01"
    },
    "camera": {
      "flame_detected": false,
      "flame_confidence": 0.0,
      "smoke_detected": false
    }
  }
}

Response (200):
{
  "batch_id": "uuid",
  "sensors_processed": 7,
  "data_quality": 0.94,
  "fused_state": {
    "motion_status": "stationary",
    "breathing_status": "normal",
    "hazard_proximity": "unknown",
    "location_confidence": 0.88,
    "is_safe": true
  }
}
```

**Frequency**: Every 0.5 seconds (or ~1000+ data points per user)  
**Processing**: Parallel 7-channel processing  
**Quality Metrics**: Data completeness, sensor accuracy

---

## 6. Stage 4.5: Hazard Map Generation (Bayesian Fusion)

### GET /hazard-map/current
**Get current real-time hazard map**

```json
Request:
{
  "facility_id": "uuid",
  "include_prediction": true,
  "prediction_seconds": 60
}

Response (200):
{
  "facility_id": "uuid",
  "timestamp": "2026-05-30T10:00:05Z",
  "version": 127,
  "risk_map": {
    "space_id_4E_corridor": {
      "fire": 0.05,
      "smoke": 0.85,
      "crowd": 0.7,
      "structural": 0.0,
      "electrical": 0.0,
      "composite_risk": 0.62
    },
    "space_id_4C_elevator": {
      "fire": 0.02,
      "smoke": 0.4,
      "crowd": 0.6,
      "composite_risk": 0.34
    },
    "space_id_4A_ramp": {
      "fire": 0.01,
      "smoke": 0.15,
      "crowd": 0.2,
      "composite_risk": 0.12
    }
  },
  "prediction_60s": {
    "space_id_4E_corridor": { "composite_risk": 0.92 },
    "space_id_4C_elevator": { "composite_risk": 0.50 },
    "space_id_4A_ramp": { "composite_risk": 0.18 }
  },
  "source": "bayesian_fusion",
  "confidence": 0.91
}
```

**Update Frequency**: Every 1 second  
**Latency**: < 500ms  
**Cache TTL**: 5 seconds

---

## 7. Stage 5: Route Calculation

### POST /route/calculate
**Calculate personalized evacuation route**

```json
Request:
{
  "user_id": "uuid",
  "facility_id": "uuid",
  "current_location": {
    "floor": 4,
    "x": 42.5,
    "y": 18.3
  },
  "user_profile_type": "wheelchair",
  "include_alternatives": true,
  "include_explanation": true,
  "hazard_map_timestamp": "2026-05-30T10:00:05Z"
}

Response (200):
{
  "routes": [
    {
      "route_type": "primary",
      "path": [
        { "space_id": "4A", "action": "go_to_ramp", "distance_m": 25 },
        { "space_id": "3A", "action": "proceed_through", "distance_m": 30 },
        { "space_id": "exit_B", "action": "exit_facility", "distance_m": 0 }
      ],
      "total_distance_m": 55,
      "eta_seconds": 180,
      "risk_score": 0.21,
      "risk_breakdown": {
        "fire_risk": 0.05,
        "smoke_risk": 0.15,
        "crowd_risk": 0.01
      },
      "constraints_applied": ["wheelchair_accessible", "avoid_stairs"],
      "accessibility_features": ["ramp", "wide_corridor", "elevator"]
    },
    {
      "route_type": "alternative",
      "path": [...],
      "eta_seconds": 240,
      "risk_score": 0.35,
      "reason": "Use if primary becomes blocked"
    }
  ],
  "generated_at": "2026-05-30T10:00:05.420Z",
  "version": 1
}
```

**Algorithm**: A* + Bayesian Risk + Personal Constraints + Future Hazard Prediction  
**Execution Time**: < 500ms  
**Update Interval**: 5 seconds (or event-driven on hazard change)

---

## 8. Path Explanation Generation (LLM-Based)

### GET /route/:route_id/explain
**Get natural language explanation for recommended route**

```json
Request:
{
  "user_id": "uuid",
  "language": "ko",
  "include_alternatives_reasoning": true
}

Response (200):
{
  "route_id": "uuid",
  "explanation": "현재 가장 가까운 계단 4E는 연기 농도가 매우 높습니다(85%). 
                 귀하는 휠체어 사용자이므로 계단을 사용할 수 없습니다. 
                 가장 가까운 엘리베이터(4C)는 현재 사람이 많습니다(60% 혼잡). 
                 따라서 경사로(4A)를 추천합니다. 경사로는 연기가 적고(15%), 
                 휠체어로 접근 가능하며, 예상 대피 시간은 3분 40초입니다. 
                 신뢰도: 92%",
  "decision_factors": {
    "smoke_level_at_stair": 0.85,
    "crowd_density_at_exit_b": 0.6,
    "user_constraint": "wheelchair",
    "guardian_distance_m": 45.2,
    "applied_safety_margin": 2.0,
    "future_hazard_score_60s": 0.18
  },
  "confidence_score": 0.92,
  "uncertainty_factors": ["sensor_noise_0.05", "crowd_density_variance_0.1"],
  "alternatives_explanation": {
    "why_not_stair_4E": "High smoke (85%), health hazard for user",
    "why_not_elevator_4C": "Moderate congestion (60%), longer wait time"
  }
}
```

**Model**: Claude API (LLM)  
**Latency**: 1-2 seconds  
**Languages**: 12+ supported (auto-detect from device OS)

---

## 9. Real-Time Route Updates (WebSocket/SSE)

### GET /route/:route_id/live-updates (Server-Sent Events)
**Real-time route recalculation feed**

```
GET /route/uuid-123/live-updates

Response: text/event-stream

data: {
  "event_type": "route_updated",
  "timestamp": "2026-05-30T10:00:10Z",
  "reason": "hazard_change",
  "new_path": [...],
  "eta_change_seconds": -5,
  "risk_score_change": -0.05,
  "action": "continue_current_path"
}

data: {
  "event_type": "route_changed",
  "timestamp": "2026-05-30T10:00:15Z",
  "reason": "exit_blocked_new_alternative",
  "new_path": [...],
  "eta_seconds": 220,
  "action": "change_direction_now"
}
```

**Trigger Events**:
- Hazard map significant change (> threshold)
- User location change (> 10m from predicted)
- Exit blocked
- Crowd density spike

**Latency**: < 100ms (event-driven)  
**Fallback**: SSE with 5-second polling if WebSocket unavailable

---

## 10. Responder-Specific APIs

### GET /responder/dashboard
**Real-time dashboard for firefighters/rescuers**

```json
Response (200):
{
  "facility_id": "uuid",
  "event_id": "uuid",
  "timestamp": "2026-05-30T10:00:00Z",
  "evacuation_status": {
    "total_users": 4000,
    "users_evacuated": 2200,
    "users_remaining": 1800,
    "vulnerable_users_remaining": [
      {
        "user_id": "uuid",
        "person_type": "wheelchair",
        "last_location": { "floor": 5, "x": 42, "y": 18 },
        "last_location_time": "2026-05-30T10:00:05Z",
        "recommended_rescue_path": [...],
        "priority": "HIGH"
      }
    ]
  },
  "hazard_map": { ... },
  "bottleneck_zones": [
    { "space_id": "exit_B", "congestion": 0.92, "estimated_exit_time_s": 180 }
  ]
}
```

---

## 11. Facility Management APIs

### POST /facility/register
**Register facility to FireNavi system**

```json
Request:
{
  "name": "Cruise Ship Paradise",
  "facility_type": "cruise",
  "capacity": 4000,
  "floor_count": 5,
  "address": "Port of Miami, FL",
  "emergency_contact_phone": "+1-305-555-0100",
  "wifi_ssid": "ParadiseGuest"
}

Response (201):
{
  "facility_id": "uuid",
  "status": "registered",
  "onboarding_steps": ["install_wifi_sensors", "map_spaces", "test_system"]
}
```

### POST /facility/:facility_id/spaces/import
**Bulk import floor plan and space definitions**

```json
Request:
{
  "spaces": [
    {
      "name": "Corridor 4E",
      "space_type": "corridor",
      "floor": 4,
      "coords": [[40.7, -74.0], [40.71, -74.0], [40.71, -74.01], [40.7, -74.01]],
      "connected_spaces": ["room_401", "staircase_4", "exit_B"]
    }
  ]
}

Response (200):
{
  "spaces_imported": 45,
  "status": "success"
}
```

---

## 12. Analytics & Reporting

### GET /evacuation/:event_id/statistics
**Get post-evacuation statistics**

```json
Response (200):
{
  "event_id": "uuid",
  "facility_id": "uuid",
  "evacuation_time_minutes": 12,
  "total_users": 4000,
  "evacuated_users": 3950,
  "by_person_type": {
    "general": { "total": 3500, "evacuated": 3450, "avg_time_s": 720 },
    "elderly": { "total": 300, "evacuated": 290, "avg_time_s": 900 },
    "wheelchair": { "total": 50, "evacuated": 45, "avg_time_s": 1200 },
    "child": { "total": 150, "evacuated": 150, "avg_time_s": 680 }
  },
  "bottleneck_analysis": [...],
  "ai_effectiveness": {
    "routes_calculated": 3950,
    "route_changes": 156,
    "crowd_optimization_benefit": "18% faster evacuation"
  }
}
```

---

## 13. Error Responses

### Standard Error Format

```json
Response (400):
{
  "error": "INVALID_REQUEST",
  "error_code": "E001",
  "message": "Missing required field: facility_id",
  "details": { "field": "facility_id", "reason": "required" }
}

Response (401):
{
  "error": "UNAUTHORIZED",
  "error_code": "E002",
  "message": "Invalid or expired token"
}

Response (429):
{
  "error": "RATE_LIMITED",
  "error_code": "E003",
  "message": "Too many requests",
  "retry_after_seconds": 60
}

Response (500):
{
  "error": "INTERNAL_ERROR",
  "error_code": "E500",
  "message": "Internal server error",
  "request_id": "uuid"
}
```

---

## 14. Performance Requirements

| Endpoint | Latency | Throughput |
|----------|---------|-----------|
| /fire/trigger | 50ms | 1 req/sec |
| /localization/update | 200ms | 4000 concurrent users |
| /sensors/batch | 300ms | 4000 req/sec |
| /hazard-map/current | 500ms | 100 req/sec |
| /route/calculate | 500ms | 100 req/sec |
| /route/:id/explain | 2000ms | 50 req/sec |

---

## 15. Authentication & Security

**JWT Token Structure**:
```json
{
  "sub": "user_id",
  "facility_id": "uuid",
  "person_type": "wheelchair",
  "exp": 1700000000,
  "iat": 1699996400
}
```

**API Key Headers**:
```
Authorization: Bearer <jwt_token>
X-Device-ID: <phone_id>
X-Facility-ID: <facility_id>
```

**HTTPS/TLS**: Required (v1.2+)  
**CORS**: Enabled for web apps  
**Rate Limiting**: 100 req/min per user, 10000 req/min per facility

---

## 16. Versioning

**Current Version**: v4.0  
**Deprecation Policy**: 6 months notice  
**Breaking Changes**: New major version (v5.0)

---

**Last Updated**: 2026-05-30  
**API Status**: Production Ready

# PROMPT.md — Build the Amazon IT Support Engineer I Lab Platform

You are Claude Code acting as a senior IT infrastructure engineer, lab architect, instructional designer, and full-stack developer.

## Mission

Build a realistic, hands-on training platform that prepares the learner for an Amazon IT Support Engineer I / OpsTech IT Solutions (OTS) role using the supplied job requirements.

The platform must teach by doing. It should simulate a warehouse/operations IT environment where the learner deploys systems, troubleshoots incidents, documents work, performs root-cause analysis, and practices production-safe decision making.

Do NOT build a simple quiz/tutorial website. Build an interactive IT operations lab platform.

## Core requirements

Create a polished web application with:

1. Dashboard
2. 22 structured labs
3. 12-week study roadmap
4. Virtualized/simulated infrastructure views
5. Incident/ticket system
6. Network topology
7. Windows Server/AD/DNS/DHCP/DFS/Print Services labs
8. Cisco/networking labs
9. Endpoint deployment and PC repair labs
10. Windows/Linux/macOS troubleshooting labs
11. High-availability incident simulations
12. RCA and 5-Whys workflow
13. SOP/knowledge-base editor
14. Asset lifecycle management
15. Video-conference troubleshooting
16. IT closet/data-center simulation
17. Project/change/rollback workflow
18. Shift simulation
19. Final warehouse IT engineer capstone
20. Progress tracking and skill matrix
21. Interview preparation
22. Portfolio/evidence generation

## Lab philosophy

Every lab should have:

- Business scenario
- Objectives
- Prerequisites
- Environment
- Starting state
- Tasks
- Observable system state
- Troubleshooting challenge
- Hints
- Validation tests
- Expected evidence
- Root-cause section
- Resolution section
- Rollback plan
- SOP requirement
- Interview question
- Scoring rubric

The learner should not receive the answer immediately.

## AI tutor

Integrate an AI tutor using local Ollama as the preferred provider.

Provider priority:

1. Ollama local models
2. OpenRouter free models when configured
3. Clear configuration/error state if neither is available

The AI tutor must behave like an instructor, not an answer generator.

Tutor rules:

- Ask diagnostic questions.
- Give progressive hints.
- Explain concepts.
- Ask the learner what they would check next.
- Do not reveal the final solution unless the lab explicitly enters a solution-review phase.
- Never fabricate command output.
- Distinguish facts from assumptions.
- Encourage evidence-based troubleshooting.
- Teach production safety and change control.
- After the learner solves an incident, explain why the solution worked.

AI features:

- "Ask Tutor"
- "Give me a hint"
- "Explain this concept"
- "What should I check next?"
- "Review my troubleshooting"
- "Interview me"
- "Generate a similar incident"
- "Create a harder version"

## Realistic operations scenarios

Model the environment after a high-volume warehouse/operations site.

Example assets:

- Domain Controller
- DNS/DHCP server
- File server
- Print server
- Windows workstations
- Linux server
- Network switches
- Routers
- Printers
- Scanners
- Conference-room equipment
- Asset inventory
- Monitoring/alerting
- Applications

Create realistic incidents such as:

- DHCP exhaustion
- Incorrect DNS record
- AD authentication failure
- Disabled user
- Bad group membership
- Broken NTFS permission
- DFS availability issue
- Print queue failure
- Failed Windows service
- Endpoint deployment failure
- Bad driver
- Low disk space
- VLAN mismatch
- Trunk failure
- Switch port shutdown
- DNS/network path issue
- Intermittent packet loss
- Conference audio failure
- Recurring outage
- Asset deployment error

## Safety

All labs must run in isolated, authorized environments.

Never instruct the learner to attack, damage, disrupt, scan, or modify systems they do not own or have permission to administer.

Use simulated systems, VMs, Cisco Packet Tracer, or explicitly authorized hardware.

Destructive actions must include:

- warning
- scope
- expected impact
- rollback
- validation

## Lab engine

Implement a reusable lab engine rather than hard-coding every lab separately.

Each lab should be data-driven.

Recommended model:

Lab
- id
- title
- category
- difficulty
- estimated_minutes
- objectives
- prerequisites
- scenario
- environment
- tasks
- faults
- hints
- validation
- rubric
- required_evidence

Incident
- id
- severity
- symptoms
- hidden_root_cause
- affected_assets
- allowed_actions
- forbidden_actions
- hints
- validation_tests
- resolution

Skill
- networking
- Windows Server
- AD
- DNS
- DHCP
- DFS
- Print Services
- SCCM/MECM
- PC repair
- endpoint deployment
- Linux
- macOS
- Cisco
- TCP/IP
- OSI
- cabling
- high availability
- RCA
- documentation
- project management
- asset management

## Simulation behavior

The application should expose realistic state.

For example:

User reports:
"Several scanners cannot connect."

The learner should investigate:

1. Client IP
2. DHCP lease
3. Gateway
4. DNS
5. VLAN
6. Switch port
7. Server reachability
8. Application port

The platform should reveal evidence progressively based on actions.

Do not simply display the root cause.

## Scoring

Score:

- Correct diagnosis
- Evidence gathered
- Troubleshooting sequence
- Production safety
- Communication
- Resolution
- Validation
- Documentation
- RCA quality

Penalize:

- random changes
- skipping validation
- unsafe production changes
- guessing without evidence
- repeatedly using hints

## Portfolio mode

Allow completed labs to become portfolio entries.

Generate:

- Problem
- Environment
- Troubleshooting
- Root cause
- Resolution
- Validation
- Business impact
- Lessons learned

Do not expose secrets or real credentials.

## Study roadmap

Include the supplied 12-week progression:

Weeks 1–2:
Foundations / AD / DNS / DHCP

Weeks 3–4:
DFS / Print / Endpoint / PC repair

Weeks 5–6:
Multi-OS / Cisco / TCP/IP / OSI / cabling

Weeks 7–8:
High availability / incidents / RCA

Week 9:
Video conferencing / assets / infrastructure

Week 10:
Projects / SOPs / change management

Week 11:
Operations shift simulation

Week 12:
Capstone + interview

## Final capstone

Build a warehouse site where the learner is the primary IT Support Engineer.

Require the learner to resolve:

- AD authentication failure
- DNS failure
- DHCP issue
- VLAN/port problem
- Windows workstation failure
- Printer outage
- File-share issue
- Endpoint software deployment issue
- Conference-room issue
- Recurring network incident requiring RCA

The capstone should produce a final score and readiness assessment.

## UI/UX

Make it professional and enterprise-oriented.

Use:

- left navigation
- dashboard cards
- lab status
- skill matrix
- incident queue
- topology view
- terminal/console panels
- evidence panel
- AI tutor panel
- progress indicators
- dark/light mode if supported

Avoid making it look like a generic coding bootcamp.

## Implementation rules

Before changing existing code:

1. Inspect the repository.
2. Identify framework and architecture.
3. Identify current features.
4. Preserve working functionality.
5. Make incremental changes.
6. Test after each major feature.
7. Fix errors before continuing.

Do not rewrite the application unnecessarily.

## Definition of done

The platform is complete only when:

- All 22 labs are represented.
- Labs are interactive.
- Progress persists.
- Incidents have hidden root causes.
- Evidence collection works.
- Scoring works.
- AI tutor works with Ollama when available.
- OpenRouter fallback is configurable.
- Capstone works.
- Interview mode works.
- Portfolio mode works.
- No major console/runtime errors remain.
- Existing application features continue working.

Start by auditing the existing repository and producing an implementation plan before making large changes.

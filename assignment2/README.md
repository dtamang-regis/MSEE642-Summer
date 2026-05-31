# Hands-On Project #2: Vulnerability Analysis
## The Secure Software Development Lifecycle and the Threat Model

**Course:** MSSE Security Course  
**Project:** Assignment 2 Group Project  
**Student Name(s):** Depen Tamang  
**Date:** May 23, 2026

---

# Part 1 — Secure Design Document Overview

## Project Description

The Hiking Club Application is a web-based system designed to help a hiking organization manage hiking events and member participation. The application allows guests to browse upcoming hiking trips, while registered members can sign in, manage their profiles, and register for events. Trip leaders and administrators have additional permissions to create and manage events, review member participation, and manage financial operations for paid trips. The system stores both public and confidential information, including member medical information and payment-related data. Because the application handles sensitive user information and administrative operations, security is an important part of the system design.

## Organization Description

The organization using this application is a community hiking club that organizes outdoor hiking trips and activities for its members. The club includes regular members, trip leaders, and system administrators. Members use the application to browse and register for events, while trip leaders organize hiking trips and manage attendance. System administrators are responsible for account management, financial operations, and maintaining the integrity of the platform.

## Deployment Environment

The Hiking Club Application will be deployed in a cloud-hosted environment using separate frontend and backend servers. The frontend web server will be publicly accessible over the internet and will handle client requests, authentication, and application logic. The backend database server will be deployed in a private network that is not directly accessible from the internet. Firewalls will separate public-facing systems from internal systems to reduce the risk of unauthorized access. Communication between users and the web server will use HTTPS encryption to protect sensitive information during transmission.

## Secure Software Concepts

Several secure software concepts are important for the Hiking Club Application. The system requires strong authentication and authorization because different user roles have different access levels. Members should only be able to edit their own profiles, while administrators should have elevated permissions for administrative functions. Sensitive information such as medical notes and payment information must be protected from unauthorized access.

Input validation is necessary to reduce the risk of attacks such as SQL injection and cross-site scripting. Passwords should be securely hashed before being stored in the database. The application should also use HTTPS to encrypt network communication between users and the server. Logging and auditing mechanisms should be implemented to track administrative actions and detect suspicious activity. In addition, the backend database server should remain isolated within a private network protected by firewalls to minimize direct exposure to attackers.

---

# Part 2 — Threat Model Assessment

## Part 2A — Architecture Diagram

![alt text](<images/Screenshot 2026-05-23 at 12.55.50 PM.png>)

### System Architecture Overview

The Hiking Club Application follows a multi-tier web architecture consisting of client systems, a frontend web server, and a backend database server. The frontend web server is accessible from the public internet, while the backend database server is isolated within a private internal network protected by firewalls.

The architecture includes the following components:

- Guest Client
- Member Client
- Admin Client
- Front End Web Server
- Backend Database Server
- Public and Private Networks
- Firewalls
- Trust Boundaries

### Network Layout

| Component | Network Type | Example IP Address |
|-----------|--------------|-------------------|
| Guest Client | Public Internet | Dynamic Public IP |
| Member Client | Public Internet | Dynamic Public IP |
| Admin Client | Public Internet | Dynamic Public IP |
| Front End Web Server | Public DMZ Network | 34.120.10.15 |
| Backend Database Server | Private Internal Network | 10.0.1.10 |

### Trust Boundaries

The application contains multiple trust boundaries:

- Between external users and the frontend web server.
- Between the frontend web server and the backend database server.
- Between administrative functions and regular member functionality.

These trust boundaries help separate trusted internal systems from untrusted external networks.

### Data Flow Description

- Guests browse available hiking trips through the frontend web server.
- Members authenticate through the frontend server and register for events.
- Admins and trip leaders log into the administrative portal to manage events and users.
- The frontend web server communicates with the backend database server to retrieve and update application data.
- The database server is only accessible from the frontend web server through private networking rules and firewall protections.

---

## Part 2B — STRIDE Threat Model

### 1. Spoofing

An attacker may attempt to impersonate a legitimate member or administrator by stealing login credentials through phishing attacks or weak passwords. If successful, the attacker could gain unauthorized access to confidential member information or administrative functions. To reduce this risk, the application should implement strong password requirements, multi-factor authentication, and secure session management.

### 2. Tampering with Data

Attackers may attempt to modify event registrations, payment information, or member records by exploiting insecure input handling or weak database protections. Tampering could lead to corrupted records or unauthorized financial changes. Input validation, parameterized SQL queries, and strict access controls should be implemented to protect against unauthorized data modification.

### 3. Repudiation

A member or administrator may deny performing actions such as deleting events, modifying payment records, or removing users from hiking trips. Without proper logging, it may be difficult to determine who performed a specific action. Audit logging and timestamped activity records should be implemented to support accountability and incident investigation.

### 4. Information Disclosure

The system stores sensitive information including medical details, private notes, and payment-related information. Improper access control or insecure data transmission could expose confidential information to unauthorized users. HTTPS encryption, role-based access control, and database security measures should be used to protect sensitive data from disclosure.

### 5. Denial of Service

An attacker may overwhelm the frontend web server with excessive requests, preventing legitimate users from accessing the application. This could interrupt event registration and administrative operations. Rate limiting, traffic monitoring, firewalls, and cloud-based denial-of-service protections can help reduce the impact of these attacks.

### 6. Elevation of Privilege

A regular member may attempt to exploit authorization weaknesses to gain administrator or trip leader privileges. This could allow unauthorized access to confidential information or administrative tools. The system should enforce role-based access control and verify user permissions on both the frontend and backend systems.

---

## Part 2C — OWASP Threat Model

### Assessment Scope

The Hiking Club Application handles several types of sensitive information that must be protected. Important assets include member account information, medical records, payment data, event registration information, and administrative functions. A compromise of these assets could impact member privacy, financial integrity, and the reliability of the application.

### Vulnerabilities

Several vulnerabilities could affect the application if security controls are not properly implemented. Weak authentication practices could lead to account compromise. Improper input validation may expose the system to SQL injection or cross-site scripting attacks. Broken access control could allow unauthorized users to access confidential data or administrative functions. Insecure communication channels may expose sensitive information during transmission.

### Countermeasures

To reduce security risks, the application should implement multiple defensive controls. Passwords should be securely hashed using modern hashing algorithms. HTTPS encryption should be enforced for all network communication. Role-based access control should restrict access to sensitive information based on user roles. Input validation and parameterized queries should be used to prevent injection attacks. Firewalls and private networking should isolate the backend database server from direct internet access. Logging and monitoring systems should also be implemented to detect suspicious behavior.

### Prioritized Risks

| Priority | Risk | Impact |
|----------|------|--------|
| 1 | Unauthorized Admin Access | High |
| 2 | Exposure of Medical Information | High |
| 3 | SQL Injection Attacks | High |
| 4 | Payment System Compromise | Medium |
| 5 | Denial of Service Attacks | Medium |
| 6 | Unauthorized Profile Modification | Low |

---

# Conclusion

The Hiking Club Application contains multiple areas that require strong security protections because the system manages sensitive user, medical, and financial information. By implementing secure software development practices, network isolation, role-based access control, encryption, and continuous monitoring, the organization can significantly reduce the likelihood and impact of common web application attacks. Threat modeling using STRIDE and OWASP methodologies helps identify critical risks early in the software design process and supports the development of a more secure application architecture.

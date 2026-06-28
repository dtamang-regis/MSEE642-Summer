# Part 1 – Penetration Testing Documentation

## 1. Summary Table

| PHASE | DESCRIPTION | TOOLS |
| ----- | ----------- | ----- |
| Website Penetration Testing: Information Gathering (Chapter 14) | Information gathering is the foundational phase of penetration testing where the tester collects comprehensive data about the target website, including its infrastructure, technologies, hosting details, and potential vulnerabilities. This phase involves passive reconnaissance techniques that do not directly interact with the target, as well as active scanning to identify open ports, running services, and web application frameworks. The information gathered during this phase is critical for understanding the attack surface and planning subsequent exploitation attempts. | Netcraft |
| Website Penetration Testing: Gaining Access (Chapter 15) | Gaining access is the exploitation phase where penetration testers attempt to compromise the target web application by exploiting identified vulnerabilities. This phase involves actively testing authentication mechanisms, input validation, session management, and other security controls to bypass defenses and obtain unauthorized access to sensitive data or administrative functions. Testers may use techniques such as SQL injection, cross-site scripting, brute force attacks, or exploiting misconfigurations to elevate privileges and demonstrate the impact of security weaknesses. | OWASP ZAP |

---

## 2. Tool Description and Analysis

### Tool 1: Netcraft

#### Official Vendor Website
https://www.netcraft.com/

#### Description
Netcraft is a comprehensive internet services company that provides web server and operating system detection, security research, and anti-phishing services. Their Site Report tool allows penetration testers to gather detailed information about target websites, including hosting provider, server type, SSL certificate details, and historical data. The platform maintains extensive databases of internet infrastructure and provides real-time monitoring of web technologies and security incidents. Netcraft's services are widely used by security professionals for reconnaissance and threat intelligence gathering.

#### Is the tool included in Kali Linux 2019 or does it require manual installation?
Netcraft is not included in Kali Linux 2019 by default. While Kali includes various web reconnaissance tools, the official Netcraft Site Report is a web-based service that requires manual access through a web browser. However, Kali Linux includes alternative tools such as `whatweb`, `builtwith`, and `wafw00f` that can provide similar information gathering capabilities for local scanning.

#### How would this tool be used to test the Hiking Club application?
Netcraft would be used during the initial reconnaissance phase of testing the Hiking Club website to gather critical infrastructure information. By running the Hiking Club domain through Netcraft's Site Report, a penetration tester could identify the web server technology (e.g., Apache, Nginx), hosting provider, SSL/TLS configuration, and any known security issues associated with that infrastructure. This information would help identify potential vulnerabilities such as outdated server versions, weak SSL configurations, or hosting on shared infrastructure that could be exploited. Additionally, Netcraft's historical data could reveal if the Hiking Club website has experienced previous security incidents or if there have been recent changes to its infrastructure that might indicate a rebuild following the ransomware attack mentioned in the scenario.

---

### Tool 2: OWASP ZAP (Zed Attack Proxy)

#### Official Vendor Website
https://www.zaproxy.org/

#### Description
OWASP ZAP is a free, open-source web application security scanner developed by the OWASP community specifically for penetration testing and security auditing of web applications. It provides automated scanning capabilities combined with manual testing tools, allowing security professionals to identify vulnerabilities such as SQL injection, cross-site scripting (XSS), broken authentication, and other OWASP Top 10 security issues. ZAP operates as a man-in-the-middle proxy that intercepts and analyzes HTTP/HTTPS traffic between the browser and the target application, enabling both passive and active security testing. The tool includes features for spidering/crawling web applications, fuzzing input parameters, session management analysis, and generating comprehensive security reports.

#### Is the tool included in Kali Linux 2019 or does it require manual installation?
OWASP ZAP is included in Kali Linux 2019 by default and can be launched from the applications menu under "Web Applications Analysis" or by running the command `zaproxy` from the terminal. It is one of the pre-installed security tools that comes with the standard Kali Linux distribution, making it readily available for penetration testing without requiring additional installation steps.

#### How would this tool be used to test the Hiking Club application?
OWASP ZAP would be used to actively test the Hiking Club web application for security vulnerabilities that could be exploited during the gaining access phase. The penetration tester would configure their browser to proxy traffic through ZAP, then navigate through the Hiking Club website to allow ZAP to capture all HTTP requests and responses. ZAP's spider feature would crawl the application to discover all pages, forms, and API endpoints. The automated scanner would then test each input point for common vulnerabilities including SQL injection in login forms, XSS in user inputs, authentication bypass attempts, and session management flaws. For the Hiking Club specifically, ZAP would test the user registration and login forms for credential stuffing and brute force vulnerabilities, examine the event management system for authorization issues, and analyze the contact form for injection attacks. The tool would also identify any security misconfigurations, sensitive data exposure, or broken access controls that could allow an attacker to gain unauthorized access to member data or administrative functions. The comprehensive report generated by ZAP would provide the organization with actionable findings to remediate security issues before the application is deployed to production.

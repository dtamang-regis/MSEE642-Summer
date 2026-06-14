# HANDS-ON PROJECT 3: Penetration Testing with Kali Linux, Metasploit, and Metasploitable2

## Introduction

This hands-on project provides practical experience with penetration testing tools and methodologies using Kali Linux, the Metasploit Framework, and the Metasploitable2 vulnerable virtual machine. Penetration testing is a critical component of cybersecurity that involves simulating cyberattacks against systems to identify vulnerabilities before malicious actors can exploit them. Through this lab exercise, students gain hands-on experience with port scanning techniques using Metasploit, understand the differences between ethical and unethical hacking perspectives, and research industry-standard vulnerability scanning tools such as Nessus. The project reinforces the importance of systematic security assessment in protecting organizational assets and demonstrates how legitimate security professionals use the same tools as attackers to strengthen defensive postures.

---

## Part 1: Starting Metasploit Framework and Metasploitable2

### Screenshot 1 - Kali Linux and Metasploitable2 Running and Connected

![alt text](<images/Screenshot 2026-05-17 at 4.28.06 PM.png>)

![alt text](<images/Screenshot 2026-05-17 at 4.23.00 PM.png>)

### Screenshot 2 - Metasploit Framework Running

![alt text](<images/Screenshot 2026-05-17 at 4.27.14 PM.png>)

---

## Part 2: Port Scanning with Metasploit

### Screenshot 3 - Port Scanner Search Results

![alt text](<images/Screenshot 2026-06-14 at 4.54.12 PM.png>)

### Screenshot 4 - Scanner Configuration

![alt text](<images/Screenshot 2026-06-14 at 4.55.42 PM.png>)

### Screenshot 5 - Port Scan Results

![alt text](<images/Screenshot 2026-06-14 at 4.56.57 PM.png>)

![alt text](<images/Screenshot 2026-06-14 at 4.57.17 PM.png>)

### Metasploit TCP Port Scanning Process

The Metasploit Framework provides a comprehensive port scanning capability through its auxiliary modules. In this lab exercise, the TCP port scanning process was initiated by first searching for available port scanner modules within the Metasploit console. The search command revealed multiple scanning options, including the TCP port scanner module that was selected for this exercise. Once the appropriate module was identified, it was loaded using the `use` command, which prepares the module for configuration and execution.

The configuration phase involved setting critical parameters for the scan. The `RHOSTS` parameter was set to the IP address of the Metasploitable2 target machine, which specifies the remote host to be scanned. The `PORTS` parameter was configured to scan ports 1 through 1024, which covers the well-known port range commonly associated with standard network services. This restriction was implemented to focus the scan on the most relevant and frequently used ports while reducing scan time and network traffic. Additional parameters such as `THREADS` could be adjusted to control the concurrency of the scanning process, optimizing performance based on system resources and network conditions.

After configuring the necessary parameters, the scan was executed using the `run` or `exploit` command within the Metasploit console. The TCP port scanner operates by attempting to establish TCP connections with each specified port on the target system. For each port, the scanner sends a SYN packet as part of the TCP three-way handshake. If the target responds with a SYN-ACK packet, the port is considered open and a service is likely listening on that port. If the target responds with a RST packet, the port is considered closed. If no response is received, the port may be filtered by a firewall or other network security device.

The scan results are displayed in real-time within the Metasploit console, showing the progress of the scan and listing discovered open ports along with associated services where possible. The results provide valuable information about the attack surface of the target system, including which services are exposed and potentially vulnerable to exploitation. This information serves as a foundation for subsequent penetration testing activities, such as vulnerability assessment and exploitation attempts.

### Scan Results

Replace this section with the actual open ports discovered during the Metasploit scan.

---

## Analysis Questions

### A. What is the purpose of port scanning from the perspective of a Black Hat hacker?

From the perspective of a Black Hat hacker, port scanning serves as a critical reconnaissance phase in the cyberattack lifecycle. The primary purpose is to identify open ports and running services on target systems without authorization, thereby mapping the attack surface and discovering potential entry points for exploitation. Black Hat hackers use port scanning to gather intelligence about target networks, identify vulnerable services, and determine which systems may be susceptible to specific exploits. This information enables attackers to prioritize their efforts, focus on the most promising targets, and develop tailored attack strategies based on the services and versions discovered. Port scanning also helps attackers avoid detection by identifying which ports are monitored by intrusion detection systems and which may provide stealthy entry points. Ultimately, for malicious actors, port scanning is a tool for unauthorized information gathering that facilitates subsequent attacks such as service exploitation, data exfiltration, or lateral movement within compromised networks.

### B. What is the purpose of port scanning from the perspective of an Ethical (White Hat) hacker?

From the perspective of an Ethical (White Hat) hacker, port scanning serves as a legitimate security assessment tool used with proper authorization to identify and remediate vulnerabilities before they can be exploited by malicious actors. White Hat hackers conduct port scanning as part of comprehensive penetration testing and vulnerability assessments to help organizations understand their security posture and address weaknesses proactively. The purpose is to discover unauthorized services, misconfigurations, and unnecessary open ports that could serve as attack vectors. Ethical hackers use port scanning results to recommend security improvements, such as closing unused ports, updating vulnerable services, implementing firewall rules, and strengthening network segmentation. This defensive approach enables organizations to reduce their attack surface, comply with security standards and regulations, and protect sensitive data and systems. Unlike Black Hat hackers, White Hat hackers operate within legal and ethical boundaries, obtaining explicit permission before conducting scans and using the results to enhance security rather than compromise it.

### C. Why did we restrict the scanned ports to 1 through 1024?

The decision to restrict the scanned ports to the range of 1 through 1024 was based on several practical and pedagogical considerations. Ports 1-1024 are known as well-known ports and are reserved by the Internet Assigned Numbers Authority (IANA) for standard network services and protocols. These ports are most commonly associated with essential services such as HTTP (port 80), HTTPS (port 443), SSH (port 22), FTP (port 21), and DNS (port 53). By focusing on this range, the scan targets the services most likely to be present on typical systems and most relevant to security assessments. This restriction reduces scan duration and network traffic, making the exercise more efficient and suitable for educational environments with limited resources. Additionally, many high-profile vulnerabilities and common attack vectors involve services running on well-known ports, making this range particularly valuable for demonstrating penetration testing concepts. Scanning all 65,535 possible ports would be time-consuming and likely yield diminishing returns, as many higher-numbered ports are used dynamically by client applications or are rarely associated with exploitable services in typical configurations.

---

## Part 3: Nessus Vulnerability Scanner

### Introduction

Nessus is a widely-recognized and industry-standard vulnerability scanner that helps organizations identify, assess, and remediate security vulnerabilities across their IT infrastructure. Developed by Tenable Network Security, Nessus was first released in 1998 and has evolved into one of the most comprehensive vulnerability assessment platforms available in the cybersecurity market. The official Nessus website is hosted at https://www.tenable.com/products/nessus, where users can access product information, documentation, and download options. The primary purpose of Nessus is to automate the vulnerability discovery process by scanning systems, networks, and applications for known security weaknesses, misconfigurations, and compliance issues. Nessus achieves this through a vast library of vulnerability plugins that are continuously updated to include the latest security advisories, Common Vulnerabilities and Exposures (CVE) entries, and threat intelligence.

Nessus operates by conducting authenticated and unauthenticated scans of target systems, examining operating systems, services, applications, and network devices for potential vulnerabilities. The scanner can detect a wide range of security issues, including missing security patches, insecure configurations, default passwords, and known software vulnerabilities. Nessus provides detailed reports that prioritize vulnerabilities based on severity, enabling security teams to focus remediation efforts on the most critical issues first. The platform supports various scan types, including network scans, web application scans, cloud infrastructure scans, and compliance scans, making it versatile for diverse security assessment needs.

### Big Picture

Nessus occupies a crucial position within the penetration testing lifecycle, specifically bridging the gap between the Scanning phase and the Vulnerability Assessment phase. In the context of the standard penetration testing methodology, which typically includes Reconnaissance, Scanning, Vulnerability Assessment, Exploitation, Post-Exploitation, and Reporting phases, Nessus primarily functions during the Scanning and Vulnerability Assessment stages.

During the Information Gathering and Reconnaissance phase, penetration testers collect general information about target systems, such as IP addresses, domain names, and organizational structure. While Nessus is not typically used for initial reconnaissance, it builds upon this foundational information to conduct more detailed technical assessments.

In the Scanning phase, Nessus performs comprehensive port and service discovery similar to the manual port scanning conducted with Metasploit in this lab. However, Nessus goes beyond simple port identification by also detecting service versions, operating system fingerprints, and configuration details. This automated scanning capability allows testers to quickly map the attack surface of target systems with greater efficiency than manual methods.

The Vulnerability Assessment phase is where Nessus truly excels. After identifying services and their versions, Nessus cross-references this information against its extensive vulnerability database to identify known security issues. This includes checking for missing patches, known CVEs, insecure configurations, and potential compliance violations. The results are typically presented with risk scores and severity ratings, helping testers prioritize which vulnerabilities require immediate attention.

While Nessus itself does not perform exploitation, the vulnerability information it provides directly informs the Exploitation phase. Penetration testers use Nessus results to identify potential exploit targets and select appropriate Metasploit modules or other exploitation tools. The detailed vulnerability reports help testers understand which services are vulnerable, what specific exploits may be effective, and what the potential impact of successful exploitation might be.

This integration makes Nessus an invaluable tool for systematic vulnerability discovery, complementing manual techniques and providing a comprehensive view of an organization's security posture. By automating much of the vulnerability identification process, Nessus enables penetration testers to focus their expertise on analyzing results, developing exploitation strategies, and providing meaningful security recommendations.

### Lab

Nessus is not installed by default in Kali Linux. Unlike many other security tools that come pre-packaged with the Kali distribution, Nessus requires separate installation and licensing. The primary reason for this exclusion is that Nessus is a commercial product with specific licensing requirements, particularly for the professional version that offers full scanning capabilities. Kali Linux does include some open-source alternatives for vulnerability scanning, such as OpenVAS, but Nessus must be obtained and installed separately from the Tenable website.

In the context of this lab exercise, Nessus was not installed or utilized. The lab focused on manual port scanning techniques using the Metasploit Framework, which provided hands-on experience with fundamental scanning concepts. However, understanding Nessus and its capabilities is essential for comprehensive penetration testing, as it represents the industry standard for automated vulnerability assessment.

If Nessus were to be used against Metasploitable2 in a lab environment, the process would involve several steps. First, Nessus would need to be installed and activated on the Kali Linux system, either using the free Nessus Home edition (for non-commercial use) or the professional edition (for commercial use). Once installed, the user would access the Nessus web interface to configure scan policies and targets. A new scan would be created with the Metasploitable2 IP address specified as the target. The scan policy could be configured to perform comprehensive vulnerability assessment, including port scanning, service detection, and vulnerability checking.

During the scan, Nessus would probe Metasploitable2's open ports, identify running services and their versions, and check for known vulnerabilities associated with those services. Given that Metasploitable2 is intentionally designed with numerous vulnerabilities for educational purposes, Nessus would likely detect many security issues, including outdated service versions, default credentials, and known exploitable vulnerabilities. The results would be presented in a detailed report showing each discovered vulnerability, its severity rating, associated CVE references, and recommended remediation steps.

![Nessus Screenshot](images/nessus.png)

### Conclusion

Nessus represents a powerful and essential tool in the modern cybersecurity toolkit, offering significant value for organizations seeking to maintain robust security postures. Its strengths include comprehensive vulnerability coverage, regular updates to address emerging threats, detailed reporting capabilities, and support for a wide range of systems and applications. The automated nature of Nessus enables security teams to conduct thorough vulnerability assessments efficiently, covering large networks that would be impractical to assess manually. The prioritization and severity scoring features help organizations focus remediation efforts on the most critical vulnerabilities, optimizing resource allocation and risk reduction.

However, Nessus also has certain limitations that users must understand. As an automated tool, Nessus may generate false positives, reporting vulnerabilities that do not actually exist or are not exploitable in the specific context. Conversely, it may produce false negatives, missing vulnerabilities that require manual detection or specialized testing techniques. Nessus primarily identifies known vulnerabilities based on its plugin database, meaning it may not detect zero-day vulnerabilities or issues that have not yet been incorporated into its scanning rules. Additionally, the commercial licensing requirements for full functionality may present cost barriers for some organizations, particularly smaller entities with limited security budgets.

Despite these limitations, Nessus remains a cornerstone of vulnerability assessment programs worldwide. When used as part of a comprehensive security strategy that includes manual testing, continuous monitoring, and incident response capabilities, Nessus provides invaluable visibility into security weaknesses and enables proactive risk management. Its integration with other security tools and platforms further enhances its utility, making it a versatile component of modern security operations centers and penetration testing methodologies.

### References

Singh, A. (2019). *Kali Linux: An Ethical Hacker's Cookbook*. Packt Publishing.

Tenable. (2024). *Nessus Vulnerability Scanner*. https://www.tenable.com/products/nessus

Tenable. (2024). *Nessus User Guide*. https://docs.tenable.com/nessus/

Offensive Security. (2024). *Kali Linux Tools Documentation*. https://www.kali.org/tools/

Kali Linux Documentation. (2024). *Official Kali Linux Docs*. https://www.kali.org/docs/

---

## Conclusion

This hands-on project provided valuable practical experience with fundamental penetration testing tools and methodologies. Through the use of Kali Linux, the Metasploit Framework, and Metasploitable2, students gained insight into how security professionals assess system vulnerabilities and how attackers identify potential entry points. The port scanning exercise demonstrated the importance of understanding network services and their associated risks, while the analysis questions highlighted the ethical distinctions between malicious and legitimate security testing. The research component on Nessus expanded understanding of automated vulnerability assessment tools and their role in comprehensive security programs.

The skills and knowledge gained through this project form a foundation for more advanced penetration testing and security assessment activities. Understanding both manual techniques, such as Metasploit port scanning, and automated tools, such as Nessus, equips cybersecurity professionals with a versatile toolkit for identifying and addressing security vulnerabilities. As threats continue to evolve, the ability to systematically assess and improve security postures remains essential for protecting organizational assets and maintaining trust in digital systems. This project reinforces the principle that effective cybersecurity requires continuous learning, practical experience, and a commitment to ethical security practices.

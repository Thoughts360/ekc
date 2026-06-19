import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  writeBatch
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase credentials for nlo21-8dc74
const firebaseConfig = {
  apiKey: "AIzaSyCih9_2TMZsN4Ifq9usonTHq6ZFQYuLInY",
  authDomain: "nlo21-8dc74.firebaseapp.com",
  projectId: "nlo21-8dc74",
  storageBucket: "nlo21-8dc74.firebasestorage.app",
  messagingSenderId: "513260933657",
  appId: "1:513260933657:web:b45ed92737f640198a5088",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore explicitly targeting the provisioned custom database ID
export const db = getFirestore(app, "ai-studio-ec36862b-2e11-46c2-88de-6e25c02bc2a1");
export const auth = getAuth(app);

// Seeding standard high-fidelity data if collections are empty
export async function seedInitialDataIfNeeded() {
  try {
    const projectSnap = await getDocs(collection(db, "projects"));
    if (!projectSnap.empty) {
      console.log("Database already initialized, skipping seeding.");
      return;
    }

    console.log("Seeding initial cybersecurity portfolio data...");

    // 1. Projects
    const projects = [
      {
        id: "wazuh-siem-monitor",
        title: "Wazuh SIEM Host Log Ingestion & Threat Monitoring",
        slug: "wazuh-siem-monitor",
        category: "Cybersecurity",
        status: "Completed",
        featured: true,
        shortDescription: "Sovereign pfSense router monitoring with Wazuh SIEM agent capture, custom detection decoders, and active IP block response rules.",
        techStack: ["Wazuh SIEM", "pfSense Gateway", "Suricata IDS", "Ubuntu Server", "Active Response"],
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
        githubUrl: "https://github.com/",
        liveDemoUrl: "",
        reportPdfUrl: "",
        date: "2026-04",
        fullWriteup: `<h3>Project Summary</h3>
<p>Developed an isolated home security monitoring system using Wazuh SIEM configured inside a Proxmox virtualized environment. The objective was to capture all state transitions, login vectors, and traffic anomalies passing through a pfSense gateway.</p>

<h3>Core Objectives</h3>
<ul class="list-disc pl-5 space-y-2">
  <li>Ingest pfSense system log streams via syslog triggers.</li>
  <li>Deploy Wazuh micro-agents on Linux and Windows endpoints to capture real-time event logs.</li>
  <li>Author custom rulesets to trigger automated blocks when credential spray signatures are detected.</li>
</ul>

<h3>Technical Details & Methodology</h3>
<p>Integrated the Suricata intrusion detection engine to write network alerts to the local Wazuh agent. Evaluated automated IP blocking using standard bash wrappers on Linux firewalls, resulting in response mitigations within 2 seconds of detection.</p>

<h3>Key Findings & Results</h3>
<p>Discovered numerous web scraper scanners aiming at test servers. Verified that the custom decoder successfully blocked 100% of recursive script injections.</p>`
      },
      {
        id: "forensia-pcap",
        title: "Forensia Pro: Active Network Packet Inspector",
        slug: "forensia-pcap",
        category: "Tools",
        status: "Live",
        featured: true,
        shortDescription: "A Python-based desktop and browser inspection tool designed to parsing PCAP logs and outputting interactive traffic mapping charts.",
        techStack: ["Python", "React Core", "Wireshark API", "Tailwind CSS", "D3.js"],
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
        githubUrl: "https://github.com/",
        liveDemoUrl: "",
        reportPdfUrl: "",
        date: "2026-02",
        fullWriteup: `<h3>Project Summary</h3>
<p>Traditional diagnostic command-line tools can make packet analysis tedious during rapid triage incidents. Forensia Pro bridges this gap by offering a beautiful parser UI.</p>

<h3>Key Features</h3>
<ul class="list-disc pl-5 space-y-1">
  <li>Upload standard PCAP/PCAPNG capture files.</li>
  <li>Interactive timeline mapping of TCP flag resets.</li>
  <li>Alert classifications based on threat repository matches.</li>
</ul>`
      },
      {
        id: "custom-malware-sandbox",
        title: "Virtual Machine Malware Sandbox Lab",
        slug: "custom-malware-sandbox",
        category: "Cybersecurity",
        status: "Completed",
        featured: false,
        shortDescription: "An isolated, host-only environment for parsing dynamic executable samples safely utilizing Procmon and Wireshark logs.",
        techStack: ["VirtualBox", "Procmon", "Wireshark", "Regshot", "Python"],
        thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
        githubUrl: "https://github.com/",
        liveDemoUrl: "",
        reportPdfUrl: "",
        date: "2025-11",
        fullWriteup: `<h3>Project Overview</h3>
<p>An completely isolated malware analysis workspace configured to execute safely. Explored static signatures, checksum matching, dynamic API trace captures, and registry alteration logs.</p>`
      }
    ];

    for (const project of projects) {
      await setDoc(doc(db, "projects", project.id), {
        ...project,
        createdAt: new Date().toISOString()
      });
    }

    // 2. Blog Posts
    const blogs = [
      {
        id: "analyzing-ssh-attacks",
        title: "Analyzing Credential Spraying Attacks via Wazuh Logs",
        slug: "analyzing-ssh-attacks",
        tags: ["CTF Write-ups", "Lab Reports"],
        excerpt: "A tactical walkthrough detailing how to setup decoders, read SSH event alerts, and formulate responses during brute force incidents.",
        readTime: "6 min read",
        published: true,
        date: "2026-05-18",
        content: `<h3>Establishing the Background</h3>
<p>Brute force attacks are one of the most common threat vectors faced by open ports. In this write-up, we look at parsing log files inside Wazuh and establishing effective threat controls.</p>

<h3>The Scenario</h3>
<p>An attacker launches a wordlist attack against port 22. Security alerts must parse failure attempts, extract source IPs, and execute firewall level drop commands if thresholds exceed three failures under 30 seconds.</p>

<pre><code class="language-bash"># Standard SSH auth log sample
Jun 19 02:22:18 primary-ubuntu sshd[12042]: Failed password for invalid user admin from 192.168.1.150 port 44322 ssh2</code></pre>

<h3>Mitigation & Code Pattern</h3>
<p>We configure Wazuh active response block rules using standard firewall directives to immediately isolate attacking nodes.</p>`
      },
      {
        id: "ctf-zero-day-zamba",
        title: "CTF Walkthrough: Splitting Open Zero-Day-Zamba",
        slug: "ctf-zero-day-zamba",
        tags: ["CTF Write-ups", "Tutorials"],
        excerpt: "A comprehensive breakdown of solving a privilege escalation vector through local misconfigurations and cron vulnerabilities.",
        readTime: "8 min read",
        published: true,
        date: "2026-03-10",
        content: `<h3>Exploration Phase</h3>
<p>Port scanning with nmap reveals the ports 80 and 8080 are currently serving default Apache server pages.</p>
<pre><code class="language-bash">nmap -sV -sC -p- 10.10.17.20</code></pre>
<p>Analyzing the custom PHP header revealed an insecure session cookie deserialization loophole which we manipulated to achieve initial shell access.</p>`
      }
    ];

    for (const blog of blogs) {
      await setDoc(doc(db, "blogPosts", blog.id), {
        ...blog,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Skills
    const skills = [
      { id: "wazuh", name: "Wazuh SIEM / Security Monitoring", category: "Security Tools", icon: "🛡️", proficiency: 90, order: 1 },
      { id: "wireshark", name: "Wireshark Packet Analysis", category: "Security Tools", icon: "🦈", proficiency: 85, order: 2 },
      { id: "snort", name: "pfSense / Snort IDS Configuration", category: "Security Tools", icon: "🧱", proficiency: 80, order: 3 },
      { id: "python", name: "Python Automation Scripting", category: "Programming", icon: "🐍", proficiency: 85, order: 4 },
      { id: "bash", name: "Linux Bash / Shell Administration", category: "Programming", icon: "💻", proficiency: 88, order: 5 },
      { id: "react", name: "React + Tailwind Integration", category: "Cloud/Infra", icon: "⚛️", proficiency: 75, order: 6 },
      { id: "kali", name: "Penetration Testing (Kali Linux)", category: "Security Tools", icon: "🐉", proficiency: 78, order: 7 }
    ];

    for (const skill of skills) {
      await setDoc(doc(db, "skills", skill.id), skill);
    }

    // 4. Certifications
    const certifications = [
      {
        id: "cert1",
        name: "Google Cybersecurity Professional Certificate",
        issuer: "Google on Coursera",
        dateEarned: "2025-08",
        badgeUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80",
        verifyUrl: "https://coursera.org/verify"
      },
      {
        id: "cert2",
        name: "CompTIA Security+ (In Progress)",
        issuer: "CompTIA Association",
        dateEarned: "Scheduled 2026-09",
        badgeUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80",
        verifyUrl: ""
      }
    ];

    for (const cert of certifications) {
      await setDoc(doc(db, "certifications", cert.id), cert);
    }

    // 5. About Doc (single doc 'content' under 'about')
    await setDoc(doc(db, "about", "content"), {
      bio: `<p>I am <strong>Elvis Kangwa Chanda</strong>, an aspiring cybersecurity specialist and SOC Analyst in training based in Lusaka, Zambia. My objective is to build safe, redundant, and resilient network ecosystems that out-think potential adversaries.</p>
<p>Ever since writing my first shell wrapper, my passion has been understanding network routing structures, monitoring login vectors, and dissecting system vulnerabilities. I enjoy setting up home labs, debugging active configurations, and compiling defensive write-ups to give back to the cybersecurity community.</p>`,
      philosophy: "To protect an architecture, you must first study the blueprints of the invader. True defensive security is built through tireless monitoring, structured logging, and persistent dynamic refinement.",
      timeline: [
        { year: "2026", title: "SOC Analyst Training & Integration Labs", description: "Configuring active response scenarios, analyzing malware vectors in sandbox virtual environments, and developing open write-ups." },
        { year: "2025", title: "Completed Google Cybersecurity Certificate & Wazuh SIEM deployment", description: "Completed certified security training focused on packet captures, asset control, and Python forensic scripts." },
        { year: "2024", title: "Cybersecurity Studies & Python Engineering", description: "Discovered computer networking logs, worked extensively on Linux shell terminal customization, and basic network mapping tools." }
      ]
    });

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding initial data: ", error);
  }
}

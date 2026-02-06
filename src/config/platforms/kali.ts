// Kali Linux specific configuration
export const kaliConfig = {
  repositories: {
    main: "http://http.kali.org/kali",
    security: "http://security.kali.org/kali-security",
  },

  // Kali metapackages (tool categories)
  metapackages: {
    default: "kali-linux-default",
    everything: "kali-linux-everything",
    headless: "kali-linux-headless",
    large: "kali-linux-large",
    
    // Specialized metapackages
    forensic: "kali-linux-forensic",
    crypto: "kali-linux-crypto",
    gpu: "kali-linux-gpu",
    iot: "kali-linux-iot",
    nethunter: "kali-linux-nethunter",
    pwtools: "kali-linux-pwtools",
    rfid: "kali-linux-rfid",
    sdr: "kali-linux-sdr",
    voip: "kali-linux-voip",
    web: "kali-linux-web",
    wireless: "kali-linux-wireless",
  },

  // Essential Kali tools (always installed)
  essentialTools: [
    "kali-linux-core",
    "kali-desktop-xfce",
    "kali-linux-top10",
    "kali-linux-headless",
  ],

  // Top 10 Kali tools (always included)
  top10Tools: [
    "nmap",
    "metasploit-framework",
    "burpsuite",
    "wireshark",
    "john",
    "sqlmap",
    "aircrack-ng",
    "hydra",
    "nikto",
    "gobuster",
  ],

  // Additional tool categories
  categories: {
    informationGathering: [
      "amap", "arp-scan", "automater", "braa", "casefile", "cdpsnarf",
      "cisco-torch", "copy-router-config", "dmitry", "dnmap", "dnsenum",
      "dnsmap", "dnsrecon", "dnstracer", "dnswalk", "dotdotpwn", "enum4linux",
      "enumiax", "exploitdb", "fernmelder", "fierce", "firewalk", "fragrouter",
      "fragroute", "ghost-phisher", "golismero", "goofile", "hping3", "ident-user-enum",
      "intrace", "ismtp", "lbd", "maltego-teeth", "masscan", "metagoofil",
      "miranda", "nbtscan-unixwiz", "nikto", "nmap", "ohrwurm", "osr-framework",
      "p0f", "parsero", "recon-ng", "set", "smtp-user-enum", "snmpcheck",
      "sslcaudit", "sslsplit", "sslstrip", "sslyze", "thc-ipv6", "theharvester",
      "tlssled", "twofi", "unicornscan", "urlcrazy", "wireshark", "wol-e",
      "xplico", "ismtp", "intrace", "hping3", "ghost-phisher", "golismero",
    ],
    
    vulnerabilityAnalysis: [
      "bbqsql", "bed", "cisco-auditing-tool", "cisco-global-exploiter",
      "cisco-ocs", "cisco-torch", "copy-router-config", "doona", "dotdotpwn",
      "greenbone-security-assistant", "hexorbase", "jsql-injection", "lynis",
      "nmap", "ohrwurm", "openvas-cli", "openvas-manager", "openvas-scanner",
      "oscanner", "powerfuzzer", "sfuzz", "sidguesser", "siparmyknife",
      "sqlmap", "sqlninja", "sqlsus", "thc-ipv6", "tnscmd10g", "unix-privesc-check",
      "yersinia",
    ],
    
    exploitationTools: [
      "armitage", "backdoor-factory", "beef-xss", "cisco-auditing-tool",
      "cisco-global-exploiter", "cisco-ocs", "cisco-torch", "commix",
      "crackle", "exploitdb", "jboss-autopwn", "linux-exploit-suggester",
      "maltego-teeth", "metasploit-framework", "msfpc", "set", "shellnoob",
      "sqlmap", "thc-ipv6", "yersinia",
    ],
    
    wirelessAttacks: [
      "aircrack-ng", "asleap", "bluelog", "blueranger", "bluesnarfer",
      "bully", "cowpatty", "crackle", "eapmd5pass", "fern-wifi-cracker",
      "ghost-phisher", "giskismet", "gqrx", "hostapd-wpe", "kalibrate-rtl",
      "killerbee", "kismet", "mdk3", "mfcuk", "mfoc", "mfterm", "multimon-ng",
      "pixiewps", "reaver", "redfang", "rtl-sdr", "spooftooph", "wifi-honey",
      "wifitap", "wifite", "wireshark",
    ],
    
    webApplications: [
      "apache-users", "arachni", "bbqsql", "blindelephant", "burpsuite",
      "cutycapt", "davtest", "deblaze", "dirb", "dirbuster", "funkload",
      "gobuster", "grabber", "hurl", "jboss-autopwn", "joomscan", "jsql-injection",
      "maltego-teeth", "padbuster", "paros", "parsero", "plecost", "powerfuzzer",
      "proxystrike", "recon-ng", "skipfish", "sqlmap", "sqlninja", "sqlsus",
      "ua-tester", "uniscan", "vega", "w3af", "webscarab", "websploit",
      "wfuzz", "wpscan", "xsser", "zaproxy",
    ],
    
    sniffingSpoofing: [
      "burpsuite", "dnschef", "fiked", "hamster-sidejack", "hexinject",
      "iaxflood", "inviteflood", "ismtp", "isr-evilgrade", "mitmproxy",
      "ohrwurm", "protos-sip", "rebind", "responder", "rtpbreak", "rtpinsertsound",
      "rtpmixsound", "sctpscan", "siparmyknife", "sipp", "sipvicious", "sniffjoke",
      "sslsniff", "sslsplit", "sthick", "tcpflow", "tcpreplay", "tcptrace",
      "tshark", "wireshark", "wifi-honey", "xspy", "yersinia", "zaproxy",
    ],
    
    postExploitation: [
      "backdoor-factory", "cymothoa", "dbd", "dns2tcp", "http-tunnel",
      "httptunnel", "intersect", "nishang", "polenum", "powersploit",
      "pwnat", "ridenum", "sbd", "shellter", "u3-pwn", "webshells",
      "weevely", "winexe",
    ],
    
    forensics: [
      "afflib-tools", "autopsy", "binwalk", "bulk-extractor", "cabextract",
      "chkrootkit", "dc3dd", "dcfldd", "ddrescue", "dff", "diStorm3",
      "dumpzilla", "extundelete", "foremost", "galleta", "guymager",
      "iphone-backup-analyzer", "p0f", "pdf-parser", "pdfid", "pdgmail",
      "peepdf", "regripper", "rifiuti", "rifiuti2", "rkhunter", "safecopy",
      "scalpel", "scrounge-ntfs", "sleuthkit", "sqlitebrowser", "srch_strings",
      "ssdeep", "tcpflow", "tcptrace", "volatility", "xplico", "yara",
    ],
    
    reverseEngineering: [
      "apktool", "dex2jar", "diStorm3", "edb-debugger", "jad", "javasnoop",
      "jd-gui", "metasm", "ollydbg", "radare2", "smali", "valgrind", "yara",
    ],
  },

  // Kali-specific tweaks
  tweaks: {
    enableRootLogin: true,      // Kali uses root by default
    setupDefaultUser: false,    // Keep root
    enableSSH: true,
    setupVNC: false,
    enableAutoLogin: false,
  },

  // Desktop environments
  desktopEnvironments: ["xfce", "gnome", "kde", "i3", "lxde", "mate"],

  // Services
  services: {
    postgresql: true,   // For Metasploit
    apache2: false,
    ssh: true,
    docker: true,
  },
};

export default kaliConfig;
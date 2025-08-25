# Data Directory

This directory contains datasets, logs, and evidence files for the NetBird SIEM project.

## 📁 Directory Structure

```
data/
├── large-datasets/          # Files >100MB (use Git LFS or GitHub Releases)
├── sample-data/             # Small sample files (<100MB)
└── README.md                # This file
```

## 🚀 Accessing Large Files

### Git LFS Files (Recommended for <100MB)
Files tracked by Git LFS are automatically handled:
- `*.csv` - Log files and datasets
- `*.pcap` - Network packet captures
- `*.zip` - Compressed archives
- `*.tar.gz` - Compressed archives

### GitHub Releases (For files >100MB)
Large files are available as GitHub Releases:

1. **Go to [Releases](https://github.com/robertpreshyl/netbird-cloud-local-siem/releases)**
2. **Download the latest release assets**
3. **Extract and use the data files**

## 📊 Available Datasets

### Sample Data (Included in Repository)
- `sample-data/kibana-4625-attacks.csv` - Sample RDP brute force data
- `sample-data/log-ingestion-benchmarks.csv` - Performance benchmarks

### Large Datasets (Available via Releases)
- **Full Kibana 4625 Attack Logs** - Complete dataset (140MB+)
- **Complete Security Onion Logs** - Full SIEM data
- **Network Packet Captures** - PCAP files for analysis

## 🔧 How to Use

### For Researchers
1. Clone the repository
2. Download large datasets from GitHub Releases
3. Use sample data for testing and validation

### For Contributors
1. Keep files <100MB in the main repository
2. Use Git LFS for essential large files
3. Create GitHub Releases for very large datasets

## 📈 Data Sources

- **Security Onion SIEM** - Local deployment
- **Azure Sentinel** - Cloud-based SIEM
- **Honeypot Logs** - Real attack data
- **Performance Metrics** - System benchmarks

## 🔒 Data Privacy

- All data is anonymized where possible
- IP addresses are from public honeypots
- No sensitive corporate or personal information
- Suitable for security research and education

# Architecture Diagrams

This directory contains network architecture diagrams for the NetBird SIEM deployment.

## Files
- `netbird-architecture.drawio` - Main network architecture diagram (open in diagrams.net)
- `security-onion-deployment.drawio` - Security Onion deployment diagram
- `honeypot-network.drawio` - Honeypot network topology

## How to View
1. Open `.drawio` files in [diagrams.net](https://app.diagrams.net/)
2. Or use the VS Code Draw.io Integration extension
3. Export as PNG/SVG for documentation

## Architecture Overview
- NetBird management server (AWS VPS)
- Security Onion SIEM (Oracle Linux 9)
- Azure Sentinel integration
- Multiple honeypot endpoints
- WireGuard VPN tunnels

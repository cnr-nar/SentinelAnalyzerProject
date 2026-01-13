from __future__ import print_function
from scapy.all import *

def process_packet(packet):
    if IP in packet:
        packet_data = {
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "size": len(packet),
            "timestamp": packet.time
        }
    if TCP in packet:
        packet_data["src_port"] = packet[TCP].sport
        packet_data["dst_port"] = packet[TCP].dport
        packet_data["flags"] = str(packet[TCP].flags)
    elif UDP in packet:
        packet_data["src_port"] = packet[UDP].sport
        packet_data["dst_port"] = packet[UDP].dport
    
    json_data = json.dumps(packet_data)
    print(f"Sending to kafka: {json_data}")

# counter = 0

# # # # def custom_action(packet):
# # # #     global counter
# # # #     counter += 1
# # # #     return 'Packet #{}: {} ==>{}'.format(counter, packet[0][1].src, packet[0][1].dst)

# # # # sniff(prn=custom_action, filter="ip", store=0)

# # def arp_display(packet):
# #    if packet[ARP].op == 1: #who-has (request)
# #       return "ARP Request: {} is asking about {}".format(packet[ARP].psrc, packet[ARP].pdst)
# #    if packet[ARP].op == 2: #is-at (response)
# #       return "ARP Response: {} has address {}".format(packet[ARP].psrc, packet[ARP].hwsrc)

# # sniff(prn=arp_display, filter="arp", store=0,   count = 10)

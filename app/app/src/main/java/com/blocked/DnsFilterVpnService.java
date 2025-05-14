package com.blocked;

import android.app.Service;
import android.content.Intent;
import android.net.VpnService;
import android.os.ParcelFileDescriptor;

import java.io.*;
import java.net.*;
import java.nio.ByteBuffer;

public class DnsFilterVpnService extends VpnService implements Runnable {

    private ParcelFileDescriptor vpnInterface;
    private Thread vpnThread;
    private boolean isRunning = false;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (vpnThread == null) {
            vpnThread = new Thread(this, "DnsVpnThread");
            vpnThread.start();
        }
        return START_STICKY;
    }

    @Override
    public void run() {
        try {
            Builder builder = new Builder();
            builder.setSession("DNS Filter VPN");
            builder.setMtu(1500);
            builder.addAddress("10.0.0.2", 32); // IP virtual da VPN
            //builder.addDnsServer("8.8.8.8");    // Interceptar DNS do Google
            builder.addRoute("8.8.8.8", 32);    // SÃ³ trÃ¡fego para DNS Ã© roteado
            builder.addRoute("8.8.4.4", 32);

            vpnInterface = builder.establish();
            isRunning = true;

            interceptDnsPackets(vpnInterface.getFileDescriptor());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void interceptDnsPackets(FileDescriptor fd) {
        try (
            FileInputStream in = new FileInputStream(fd);
            FileOutputStream out = new FileOutputStream(fd);
            DatagramSocket dnsSocket = new DatagramSocket()
        ) {
            dnsSocket.setSoTimeout(2000);
            ByteBuffer packet = ByteBuffer.allocate(32767);

            while (isRunning) {
                int length = in.read(packet.array());
                if (length > 0) {
                    packet.limit(length);

                    if (isDnsPacket(packet)) {
                        byte[] dnsQuery = new byte[length - 28];
                        System.arraycopy(packet.array(), 28, dnsQuery, 0, dnsQuery.length);

                        String domain = parseDomainFromDnsQuery(packet);

                        if (domain != null && isBlocked(domain)) {
                            // Bloqueado â†’ responder com NXDOMAIN falso
                            byte[] fakeResponse = buildFakeNxDomainResponse(dnsQuery, dnsQuery.length);
                            byte[] fullResponse = buildResponsePacket(packet, fakeResponse, fakeResponse.length);
                            out.write(fullResponse);
                            continue;
                        }

                        // Permitido â†’ proxy para DNS real (8.8.8.8)
                        DatagramPacket dnsRequest = new DatagramPacket(dnsQuery, dnsQuery.length, InetAddress.getByName("8.8.8.8"), 53);
                        dnsSocket.send(dnsRequest);

                        byte[] responseData = new byte[512];
                        DatagramPacket dnsResponse = new DatagramPacket(responseData, responseData.length);
                        dnsSocket.receive(dnsResponse);

                        byte[] fullResponse = buildResponsePacket(packet, dnsResponse.getData(), dnsResponse.getLength());
                        out.write(fullResponse);
                    }

                    packet.clear();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isDnsPacket(ByteBuffer packet) {
        int protocol = packet.get(9) & 0xFF;
        int destPort = ((packet.get(22) & 0xFF) << 8) | (packet.get(23) & 0xFF);
        return protocol == 17 && destPort == 53;
    }

    private String parseDomainFromDnsQuery(ByteBuffer packet) {
        try {
            int dnsStart = 28 + 12; // IP + UDP + DNS header
            StringBuilder domain = new StringBuilder();
            while (true) {
                int len = packet.get(dnsStart++) & 0xFF;
                if (len == 0) break;
                for (int i = 0; i < len; i++) {
                    domain.append((char) packet.get(dnsStart++));
                }
                domain.append('.');
            }
            return domain.toString();
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isBlocked(String domain) {
    	System.out.println("Domínio pego:" + domain);
        return domain.endsWith("facebook.com") || domain.endsWith("tiktok.com");
    }

    private byte[] buildFakeNxDomainResponse(byte[] originalDnsQuery, int queryLength) {
        byte[] response = new byte[queryLength];
        response[0] = originalDnsQuery[0];
        response[1] = originalDnsQuery[1];
        response[2] = (byte) 0x81; // QR=1, RD=1
        response[3] = (byte) 0x83; // RA=1, RCODE=3 (NXDOMAIN)
        response[4] = originalDnsQuery[4]; // QDCOUNT (copiado)
        response[5] = originalDnsQuery[5];
        response[6] = 0; response[7] = 0; // ANCOUNT
        response[8] = 0; response[9] = 0; // NSCOUNT
        response[10] = 0; response[11] = 0; // ARCOUNT
        System.arraycopy(originalDnsQuery, 12, response, 12, queryLength - 12);
        return response;
    }

    private byte[] buildResponsePacket(ByteBuffer originalPacket, byte[] dnsResponse, int dnsLength) {
        byte[] raw = originalPacket.array();
        byte[] response = new byte[28 + dnsLength];
        System.arraycopy(raw, 0, response, 0, 28);
        System.arraycopy(dnsResponse, 0, response, 28, dnsLength);

        int totalLen = 28 + dnsLength;
        response[2] = (byte) ((totalLen >> 8) & 0xFF);
        response[3] = (byte) (totalLen & 0xFF);

        int udpLen = 8 + dnsLength;
        response[24] = (byte) ((udpLen >> 8) & 0xFF);
        response[25] = (byte) (udpLen & 0xFF);

        return response;
    }

    @Override
    public void onDestroy() {
        isRunning = false;
        try {
            if (vpnInterface != null) vpnInterface.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        super.onDestroy();
    }
}
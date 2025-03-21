/*package com.blocked;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;

import java.net.InetSocketAddress;

public class VpnPacketHandler extends SimpleChannelInboundHandler<ByteBuf> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        byte[] packetData = new byte[msg.readableBytes()];
        msg.readBytes(packetData);

        InetSocketAddress destination = extractDestination(packetData);
        if (destination == null) {
            return;
        }

        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(ctx.channel().eventLoop())
                .channel(io.netty.channel.socket.nio.NioSocketChannel.class)
                .handler(new ChannelInitializer<io.netty.channel.socket.SocketChannel>() {
                    @Override
                    protected void initChannel(io.netty.channel.socket.SocketChannel ch) {
                        ch.pipeline().addLast(new ForwardingHandler(ctx));
                    }
                });

        ChannelFuture future = bootstrap.connect(destination).sync();
        future.channel().writeAndFlush(Unpooled.wrappedBuffer(packetData));
    }

    private InetSocketAddress extractDestination(byte[] packetData) {
    // Verifica se há dados suficientes para o cabeçalho IPv4 mínimo (20 bytes)
    if (packetData.length < 20) {
        return null;
    }
    
    // O tamanho do cabeçalho IPv4 é determinado pelos 4 bits menos significativos do primeiro byte
    int ipHeaderLength = (packetData[0] & 0x0F) * 4;
    if (packetData.length < ipHeaderLength + 4) {
        return null; // Não há bytes suficientes para extrair o cabeçalho TCP
    }
    
    // Extração do endereço IP de destino (bytes 16 a 19 da porção fixa do cabeçalho IPv4)
    String destIP = String.format("%d.%d.%d.%d",
            packetData[16] & 0xFF,
            packetData[17] & 0xFF,
            packetData[18] & 0xFF,
            packetData[19] & 0xFF);
    
    // Verifica se o protocolo é TCP (código 6)
    int protocol = packetData[9] & 0xFF;
    if (protocol != 6) {
        return null;
    }
    
    // O cabeçalho TCP inicia imediatamente após o cabeçalho IP
    // A porta de destino está nos bytes 2 e 3 do cabeçalho TCP.
    int tcpHeaderStart = ipHeaderLength;
    if (packetData.length < tcpHeaderStart + 4) {
        return null; // Não há dados suficientes para extrair a porta
    }
    
    int destPort = ((packetData[tcpHeaderStart + 2] & 0xFF) << 8)
                   | (packetData[tcpHeaderStart + 3] & 0xFF);
    
    return new InetSocketAddress(destIP, destPort);
    }

}*/
package com.blocked;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class VpnPacketHandler extends SimpleChannelInboundHandler<ByteBuf> {

    private final Map<InetSocketAddress, Channel> connectionMap = new ConcurrentHashMap<>();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        byte[] packetData = new byte[msg.readableBytes()];
        msg.readBytes(packetData);

        InetSocketAddress destination = extractDestination(packetData);
        if (destination == null) {
            return;
        }

        Channel remoteChannel = connectionMap.get(destination);

        if (remoteChannel == null || !remoteChannel.isActive()) {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(ctx.channel().eventLoop())
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new ForwardingHandler(ctx));
                        }
                    });

            ChannelFuture future = bootstrap.connect(destination).sync();
            remoteChannel = future.channel();
            connectionMap.put(destination, remoteChannel);
        }

        remoteChannel.writeAndFlush(Unpooled.wrappedBuffer(packetData));
    }

    private InetSocketAddress extractDestination(byte[] packetData) {
        if (packetData.length < 20) {
            System.err.println("Pacote muito pequeno, ignorando...");
            return null;
        }

        int ipHeaderLength = (packetData[0] & 0x0F) * 4;
        if (packetData.length < ipHeaderLength + 4) {
            System.err.println("Cabeçalho IPv4 incompleto, ignorando...");
            return null;
        }

        String destIP = String.format("%d.%d.%d.%d",
                packetData[16] & 0xFF,
                packetData[17] & 0xFF,
                packetData[18] & 0xFF,
                packetData[19] & 0xFF);

        int protocol = packetData[9] & 0xFF;
        if (protocol != 6) {
            System.err.println("Protocolo não é TCP, ignorando...");
            return null;
        }

        int tcpHeaderStart = ipHeaderLength;
        if (packetData.length < tcpHeaderStart + 4) {
            System.err.println("Cabeçalho TCP incompleto, ignorando...");
            return null;
        }

        int destPort = ((packetData[tcpHeaderStart + 2] & 0xFF) << 8) | (packetData[tcpHeaderStart + 3] & 0xFF);

        System.out.println("Destino extraído: " + destIP + ":" + destPort);
        return new InetSocketAddress(destIP, destPort);
    }
}

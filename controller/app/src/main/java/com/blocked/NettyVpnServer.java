package com.blocked;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public class NettyVpnServer {

    private final int port;
    private static boolean isRunning = false; // Evita múltiplas instâncias

    public NettyVpnServer(int port) {
        this.port = port;
    }

    public void start() {
        if (isRunning) {
            System.out.println("⚠️ Netty VPN Server já está rodando!");
            return;
        }

        isRunning = true;

        new Thread(() -> {
            EventLoopGroup bossGroup = new NioEventLoopGroup(1);
            EventLoopGroup workerGroup = new NioEventLoopGroup();
            try {
                ServerBootstrap serverBootstrap = new ServerBootstrap();
                serverBootstrap.group(bossGroup, workerGroup)
                        .channel(NioServerSocketChannel.class)
                        .childHandler(new ChannelInitializer<SocketChannel>() {
                            @Override
                            protected void initChannel(SocketChannel ch) {
                                ch.pipeline().addLast(new VpnPacketHandler());
                            }
                        });

                ChannelFuture future = serverBootstrap.bind(port).sync();
                System.out.println("✅ Netty VPN Server iniciado na porta: " + port);
                future.channel().closeFuture().sync();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                isRunning = false;
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        }).start();
    }
}

package com.blocked;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import java.net.InetSocketAddress;

public class NettyClient {

    private static final String NETTY_SERVER_IP = "127.0.0.1"; // IP do servidor Netty
    private static final int NETTY_SERVER_PORT = 9090; // Porta do servidor Netty

    public static void sendPacket(byte[] data, int length) {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<NioSocketChannel>() {
                        @Override
                        protected void initChannel(NioSocketChannel ch) {
                            ch.pipeline().addLast(new SimpleClientHandler());
                        }
                    });

            ChannelFuture future = bootstrap.connect(new InetSocketAddress(NETTY_SERVER_IP, NETTY_SERVER_PORT)).sync();
            future.channel().writeAndFlush(Unpooled.wrappedBuffer(data, 0, length));
            future.channel().closeFuture().sync();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            group.shutdownGracefully();
        }
    }
}
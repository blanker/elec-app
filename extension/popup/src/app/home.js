'use client';
// 引入 useState 和图标
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// 引入 ChevronUp, ChevronDown 图标
import { LogOut, LogIn, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"; // 引入按钮组件
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // 引入卡片组件
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // (可选) 引入头像组件
import useCommonStore from '@/store/useCommonStore';
import useMessage from "@/hooks/use-message";
import { useSearchParamsValue } from "@/hooks/sourceContext";

export default function Home() {
    const navigate = useNavigate();
    const searchParams = useSearchParamsValue();
    console.log('searchParams', searchParams);
    // 获取 user, token 和 logout 方法
    const user = useCommonStore.use.user();
    const token = useCommonStore.use.token();
    const logout = useCommonStore(state => state.logout); // 获取 logout 方法

    const { message, send } = useMessage();
    // 'ready', 'processing', 'complete', 'disabled'
    const [status, setStatus] = useState('disabled');
    // 修改状态名，控制用户信息卡片的展开/收起，默认展开
    const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(true);


    useEffect(() => {
        console.log('user', user);
        console.log('token', token);
        if (!token || !user) {
            navigate('/login');
        }
    }, [user, token, navigate]); // 添加 navigate 到依赖项

    // 处理退出登录逻辑
    const handleLogout = async () => {
        await logout(); // 调用 store 中的 logout 方法
        navigate('/login'); // 退出后导航到登录页
    };

    // 修改 handleExecute 以更新禁用状态
    const handleExecute = async () => {
        // if (isExecuting) return; // 如果正在执行，则不重复触发

        console.log("执行按钮被点击");
        // setIsExecuting(true); // 设置为执行中（禁用按钮）
        try {
            await send("GO"); // 发送消息，可以等待响应
            // 假设 send 返回 Promise 或有回调来知道何时完成
            // 或者根据 message 状态更新 isExecuting
            console.log("消息已发送");
            // 示例：假设操作很快完成或不需要等待响应，可以立即解除禁用
            // setIsExecuting(false);
            // 或者设置一个超时解除禁用
            // setTimeout(() => setIsExecuting(false), 2000); // 2秒后解除
        } catch (error) {
            console.error("执行操作失败:", error);
        }
        // 注意：何时将 isExecuting 设置回 false 取决于你的具体逻辑
        // 你可能需要监听来自 content script 的特定返回消息来解除禁用
    };

    useEffect(() => {
        console.log('HOME Page message', message);
        // 示例：如果收到特定消息表示完成，则解除禁用
        if (['ready', 'processing', 'complete'].includes(message?.status)) {
            setStatus(message.status);
        }
    }, [message]);

    // 添加条件渲染，防止在 user 为 null 时尝试解构
    if (!user) {
        // 可以在这里显示加载状态或直接返回 null，因为 useEffect 会处理重定向
        return null;
    }

    // 安全地解构用户信息
    const { name, phone, tenant } = user;
    const tenantName = tenant?.name || 'N/A'; // 处理 tenant 可能不存在的情况
    const tenantExpiryDate = tenant?.validate_date || 'N/A'; // 处理 tenant 可能不存在的情况


    // 修改函数名，切换用户信息卡片展开/收起状态
    const toggleUserInfoCard = () => {
        setIsUserInfoExpanded(!isUserInfoExpanded);
    };

    return (
        // 页面背景色
        <div className="p-4 flex flex-col justify-center gap-4 max-w-[400px] min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
            {/* 用户信息 Card - 添加展开/收起功能 */}
            <Card className={`bg-gradient-to-r from-[var(--color-chart-4)] to-[var(--color-chart-5)] ${isUserInfoExpanded ? 'py-6' : 'py-2'}`}>
                {/* 将 CardHeader 设为可点击 */}
                <CardHeader className={`flex flex-row items-center justify-between ${isUserInfoExpanded ? 'p-4' : 'p-1'} cursor-pointer`} onClick={toggleUserInfoCard}>
                    {/* 保留原来的 Header 内容 */}
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarFallback>{name ? name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        {/* {isUserInfoExpanded &&  */}
                        <div>
                            <CardTitle>{name || '用户名'}</CardTitle>
                            <CardDescription>{phone || '手机号未提供'}</CardDescription>
                        </div>
                        {/* } */}
                    </div>
                    {/* 添加切换图标 */}
                    <Button variant="ghost" size="icon">
                        {isUserInfoExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                </CardHeader>

                {/* 条件渲染 CardContent 和 CardFooter */}
                {isUserInfoExpanded && (
                    <>
                        <CardContent className="space-y-2 p-4 pt-0"> {/* 调整 padding */}
                            <p><strong>租户名称:</strong> {tenantName}</p>
                            <p><strong>到期日期:</strong> {tenantExpiryDate}</p>
                            {/* 你可以在这里添加更多用户信息 */}
                        </CardContent>
                        <CardFooter className="flex justify-end p-4 pt-0"> {/* 调整 padding */}
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" /> 退出登录
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>

            {/* 执行操作 Card - 移除展开/收起功能 */}
            {['sidePanel', 'iframe'].includes(searchParams?.source) &&
                <Card className="bg-gradient-to-t from-white to-cyan">
                    {/* 可以选择性地添加一个简单的 Header */}
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">执行操作</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col justify-center items-center gap-2"> {/* 调整 padding */}
                        <Button
                            onClick={handleExecute}
                            disabled={!['ready'].includes(status)}
                            className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 w-full" // 添加 w-full
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            {status === 'processing'
                                ? '执行中...' :
                                (status === 'ready' ? '执行操作' :
                                    (status === 'complete' ? '处理完成' : '状态不详')
                                )
                            }
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            {status === 'ready' ? '点击按钮开始处理当前页面的数据' :
                                (status === 'processing' ? <div className="w-full text-center"><div className="w-full text-center">正在处理数据，请稍候...</div><div className="w-full">如果长时间不响应，请刷新页面</div></div> :
                                    (status === 'complete' ? <div className="w-full text-center"><div className="w-full text-center">数据处理已完成！</div><div className="w-full">如果长时间不响应，请刷新页面</div></div> :
                                        '请等待页面准备就绪...'))}
                        </p>
                    </CardContent>
                    {/* CardFooter 可以根据需要保留或移除 */}
                </Card>
            }
        </div>
    );
}
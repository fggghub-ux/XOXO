/**
 * 营业厅 App 独立模块 (Business.js)
 * 真实话费数据管理、调用项目原生内置支付密码面板、10000短信与iOS横幅联动、动态日/周/月账单
 */
(function () {
    // 1. 注入专属隔离样式
    const styleId = 'business-hall-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #wechatAppUI #page-business-hall {
                --bh-theme-color: #0066FF;
                --bh-header-bg: linear-gradient(180deg, #1677FF 0%, #3086ff 50%, #f4f6f9 100%);
                --bh-btn-gradient: linear-gradient(135deg, #1677FF 0%, #0050B3 100%);
                background-color: #F4F6F9 !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-bottom: 50px !important;
                z-index: 10;
            }
            #wechatAppUI #page-business-hall::-webkit-scrollbar {
                display: none;
            }
            #wechatAppUI #wcApOverlay {
                z-index: 1000 !important;
                transition: opacity 0.15s ease !important;
            }
            #wechatAppUI #wcApOverlay .wc-ap-sheet {
                transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }

            /* 沉浸式头部背景 */
            #wechatAppUI .bh-header-bg {
                background: var(--bh-header-bg);
                padding: max(45px, env(safe-area-inset-top)) 16px 20px;
                color: #FFFFFF;
                position: relative;
            }

            /* 顶部导航 */
            #wechatAppUI .bh-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            #wechatAppUI .bh-nav-left {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #wechatAppUI .bh-back-btn {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #ffffff;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                transition: transform 0.15s;
            }
            #wechatAppUI .bh-back-btn:active {
                transform: scale(0.92);
            }
            #wechatAppUI .bh-back-btn svg {
                width: 22px;
                height: 22px;
                stroke: currentColor;
                stroke-width: 2.5;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            #wechatAppUI .bh-nav-title {
                font-size: 18px;
                font-weight: 700;
                color: #FFFFFF;
                letter-spacing: 0.5px;
            }

            /* 真实手机号与套餐展示 */
            #wechatAppUI .bh-user-phone-bar {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 16px;
            }
            #wechatAppUI .bh-user-phone-num {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 0.5px;
                font-family: -apple-system, monospace;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #wechatAppUI .bh-star-badge-wrap {
                display: flex;
                align-items: center;
                gap: 2px;
                background: linear-gradient(90deg, #FFE259 0%, #FFA751 100%);
                padding: 2px 6px;
                border-radius: 10px;
            }
            #wechatAppUI .bh-star-badge-wrap svg {
                width: 10px;
                height: 10px;
                fill: #613400;
            }
            #wechatAppUI .bh-star-badge-wrap span {
                font-size: 9px;
                color: #613400;
                font-weight: 800;
                margin-left: 2px;
            }
            #wechatAppUI .bh-user-plan-name {
                font-size: 12px;
                opacity: 0.85;
                margin-top: 4px;
            }

            /* 话费余额大卡片 */
            #wechatAppUI .bh-balance-hero-card {
                background: #FFFFFF;
                border-radius: 24px;
                padding: 20px;
                box-shadow: 0 8px 24px rgba(0, 50, 130, 0.06);
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                z-index: 2;
            }
            #wechatAppUI .bh-balance-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            #wechatAppUI .bh-balance-title {
                font-size: 13px;
                color: #8E8E93;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            #wechatAppUI .bh-balance-title svg {
                width: 14px;
                height: 14px;
                stroke: #8E8E93;
            }
            #wechatAppUI .bh-balance-amount {
                font-size: 36px;
                font-weight: 800;
                color: #1C1C1E;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                letter-spacing: -1px;
            }
            #wechatAppUI .bh-balance-status {
                font-size: 11px;
                color: #34C759;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            #wechatAppUI .bh-balance-status svg {
                width: 12px;
                height: 12px;
                stroke: currentColor;
            }
            #wechatAppUI .bh-balance-action-btn {
                background: var(--bh-btn-gradient);
                color: #fff;
                font-size: 14px;
                font-weight: 700;
                padding: 10px 22px;
                border-radius: 16px;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(22, 119, 255, 0.28);
                transition: all 0.2s;
            }
            #wechatAppUI .bh-balance-action-btn:active {
                transform: scale(0.95);
                opacity: 0.9;
            }

            /* 账单分析区 */
            #wechatAppUI .bh-bill-section {
                margin: 16px 14px;
                background: #fff;
                border-radius: 20px;
                padding: 16px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
            }
            #wechatAppUI .bh-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            #wechatAppUI .bh-section-title {
                font-size: 15px;
                font-weight: 700;
                color: #1C1C1E;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            #wechatAppUI .bh-section-title svg {
                width: 16px;
                height: 16px;
                stroke: var(--bh-theme-color);
            }

            /* iOS 分段选择器 */
            #wechatAppUI .bh-bill-segment {
                display: flex;
                background: #E5E5EA;
                border-radius: 10px;
                padding: 2px;
                margin-bottom: 16px;
            }
            #wechatAppUI .bh-bill-segment-btn {
                flex: 1;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                padding: 6px 0;
                border-radius: 8px;
                cursor: pointer;
                color: #1C1C1E;
                transition: all 0.2s;
            }
            #wechatAppUI .bh-bill-segment-btn.active {
                background: #FFFFFF;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                font-weight: 700;
            }
            #wechatAppUI .bh-bill-content-panel {
                display: none;
            }
            #wechatAppUI .bh-bill-content-panel.active {
                display: block;
                animation: bhFadeIn 0.3s ease;
            }
            @keyframes bhFadeIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
            }
            #wechatAppUI .bh-bill-summary-box {
                background: #F8F8FA;
                border-radius: 14px;
                padding: 12px 16px;
                margin-bottom: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #wechatAppUI .bh-bill-summary-label {
                font-size: 13px;
                color: #8E8E93;
                font-weight: 500;
            }
            #wechatAppUI .bh-bill-summary-value {
                font-size: 20px;
                font-weight: 800;
                color: #1C1C1E;
            }
            #wechatAppUI .bh-bill-list {
                display: flex;
                flex-direction: column;
            }
            #wechatAppUI .bh-bill-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 0.5px solid #F2F2F7;
            }
            #wechatAppUI .bh-bill-item:last-child {
                border-bottom: none;
            }
            #wechatAppUI .bh-bill-item-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            #wechatAppUI .bh-bill-icon-box {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                background: #F2F2F7;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #1C1C1E;
            }
            #wechatAppUI .bh-bill-icon-box.income {
                background: rgba(52, 199, 89, 0.12);
                color: #34C759;
            }
            #wechatAppUI .bh-bill-icon-box svg {
                width: 18px;
                height: 18px;
                stroke-width: 2;
            }
            #wechatAppUI .bh-bill-item-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            #wechatAppUI .bh-bill-item-title {
                font-size: 14px;
                font-weight: 700;
                color: #1C1C1E;
            }
            #wechatAppUI .bh-bill-item-time {
                font-size: 11px;
                color: #8E8E93;
            }
            #wechatAppUI .bh-bill-item-right {
                text-align: right;
            }
            #wechatAppUI .bh-bill-item-cost {
                font-size: 15px;
                font-weight: 800;
                color: #FF3B30;
            }
            #wechatAppUI .bh-bill-item-cost.income {
                color: #34C759;
            }
            #wechatAppUI .bh-bill-item-status {
                font-size: 11px;
                color: #8E8E93;
            }

            /* 周账单专属柱状图 */
            #wechatAppUI .bh-weekly-chart-container {
                height: 120px;
                margin-bottom: 16px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                padding: 10px 10px 0;
                background: #F8F8FA;
                border-radius: 14px;
            }
            #wechatAppUI .bh-chart-bar-wrap {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                gap: 6px;
            }
            #wechatAppUI .bh-chart-bar {
                width: 12px;
                min-height: 4px;
                background: var(--bh-theme-color);
                border-radius: 6px 6px 0 0;
                transition: height 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
                position: relative;
            }
            #wechatAppUI .bh-chart-bar-label {
                font-size: 10px;
                color: #8E8E93;
                font-weight: 600;
            }
            #wechatAppUI .bh-chart-bar-value {
                position: absolute;
                top: -16px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 9px;
                font-weight: 700;
                color: #1C1C1E;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
            }
            #wechatAppUI .bh-chart-bar-wrap:hover .bh-chart-bar-value {
                opacity: 1;
            }

            /* 充值抽屉弹窗 (Bottom Sheet) */
            #wechatAppUI .bh-drawer-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 500;
                display: none;
                justify-content: center;
                align-items: flex-end;
                opacity: 0;
                transition: opacity 0.3s;
            }
            #wechatAppUI .bh-drawer-overlay.show {
                display: flex;
                opacity: 1;
            }
            #wechatAppUI .bh-drawer-sheet {
                width: 100%;
                background: #FFFFFF;
                border-radius: 24px 24px 0 0;
                padding: 16px 16px 36px;
                transform: translateY(100%);
                transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
                box-shadow: 0 -10px 40px rgba(0,0,0,0.12);
            }
            #wechatAppUI .bh-drawer-overlay.show .bh-drawer-sheet {
                transform: translateY(0);
            }
            #wechatAppUI .bh-drawer-handle {
                width: 36px;
                height: 4px;
                background: #E5E5EA;
                border-radius: 2px;
                margin: 0 auto 16px;
            }
            #wechatAppUI .bh-drawer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 18px;
            }
            #wechatAppUI .bh-drawer-title {
                font-size: 17px;
                font-weight: 800;
                color: #1C1C1E;
            }
            #wechatAppUI .bh-drawer-close {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #F2F2F7;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                color: #8E8E93;
            }
            #wechatAppUI .bh-drawer-close svg {
                width: 14px;
                height: 14px;
                stroke: currentColor;
                stroke-width: 2.5;
            }
            #wechatAppUI .bh-recharge-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }
            #wechatAppUI .bh-recharge-item {
                border: 1.5px solid #F2F2F7;
                border-radius: 14px;
                padding: 14px 6px;
                text-align: center;
                cursor: pointer;
                position: relative;
                transition: all 0.2s cubic-bezier(0.1, 0.8, 0.2, 1);
                background: #FAFAFC;
            }
            #wechatAppUI .bh-recharge-item:active {
                transform: scale(0.96);
            }
            #wechatAppUI .bh-recharge-item.active {
                border-color: #0066FF;
                background: #F2F7FF;
            }
            #wechatAppUI .bh-recharge-amount {
                font-size: 18px;
                font-weight: 800;
                color: #1C1C1E;
            }
            #wechatAppUI .bh-recharge-item.active .bh-recharge-amount {
                color: #0066FF;
            }
            #wechatAppUI .bh-recharge-price {
                font-size: 11px;
                color: #8E8E93;
                margin-top: 2px;
            }
            #wechatAppUI .bh-recharge-discount-tag {
                position: absolute;
                top: -6px;
                right: -4px;
                background: linear-gradient(90deg, #FF4D4F 0%, #FF7875 100%);
                color: #fff;
                font-size: 9px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(255, 77, 79, 0.25);
            }
            #wechatAppUI .bh-recharge-btn-submit {
                margin-top: 18px;
                width: 100%;
                background: linear-gradient(135deg, #1677FF 0%, #0050B3 100%);
                color: #fff;
                border: none;
                border-radius: 14px;
                padding: 14px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(22, 119, 255, 0.25);
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
            }
            #wechatAppUI .bh-recharge-btn-submit svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }
            #wechatAppUI .bh-recharge-btn-submit:active {
                transform: scale(0.98);
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. 真实数据库与状态管理
    let businessData = {
        balance: 30.00,
        bills: []
    };
    let selectedAmount = 50;
    let selectedPrice = 49.75;

    function getAccountId() {
        if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) {
            return appSettings.wc_current_user_id;
        }
        return 'default';
    }

    // 从 IndexedDB 读取数据
    async function loadBusinessData() {
        const accountId = getAccountId();
        const readFunc = typeof wcReadLayoutRecord === 'function' ? wcReadLayoutRecord : () => Promise.resolve(null);
        try {
            const saved = await readFunc(`wechatBusinessData_${accountId}`);
            if (saved && typeof saved.balance === 'number') {
                businessData.balance = saved.balance;
                businessData.bills = Array.isArray(saved.bills) ? saved.bills : [];
            } else {
                // 默认初始化：30元话费，并初始化一条真实套餐分摊账单
                const now = Date.now();
                businessData.balance = 30.00;
                businessData.bills = [
                    {
                        id: 'bill_' + now,
                        title: '套餐费日均分摊',
                        type: 'cost',
                        amount: 4.30,
                        time: now
                    }
                ];
                await saveBusinessData();
            }
        } catch (e) {
            businessData.balance = 30.00;
            businessData.bills = [];
        }
    }

    // 保存数据到 IndexedDB
    function saveBusinessData() {
        const accountId = getAccountId();
        if (typeof db === 'undefined' || !db || typeof storeName === 'undefined') {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readwrite');
            tx.objectStore(storeName).put({
                id: `wechatBusinessData_${accountId}`,
                balance: businessData.balance,
                bills: businessData.bills
            });
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    // 获取当前绑定的真实手机号
    async function getRealUserPhone() {
        try {
            if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) {
                const currentId = appSettings.wc_current_user_id;
                const contactRecord = typeof wcReadLayoutRecord === 'function' ? await wcReadLayoutRecord('contactsAppData') : null;
                const users = Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : [];
                const matched = users.find(u => u.id === currentId);
                if (matched?.phone) return matched.phone;
            }
            if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_phone) {
                return String(appSettings.wc_current_user_phone);
            }
        } catch (e) {}
        return '18988206688';
    }

    // 格式化时间
    function formatTime(timestamp) {
        const d = new Date(timestamp);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const pad = (n) => String(n).padStart(2, '0');
        if (isToday) {
            return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
        return `${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    // 3. 构建/确保 DOM 存在
    function ensurePageDOM() {
        const wechatUI = document.getElementById('wechatAppUI');
        if (!wechatUI || document.getElementById('page-business-hall')) return;

        const page = document.createElement('div');
        page.id = 'page-business-hall';
        page.className = 'page';
        page.innerHTML = `
            <!-- 沉浸式顶部 -->
            <div class="bh-header-bg">
                <div class="bh-nav">
                    <div class="bh-nav-left">
                        <div class="bh-back-btn" onclick="BusinessApp.close()">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </div>
                        <div class="bh-nav-title">营业厅</div>
                    </div>
                </div>

                <div class="bh-user-phone-bar">
                    <div>
                        <div class="bh-user-phone-num">
                            <span id="bhUserPhoneDisplay">189 •••• 8820</span>
                            <div class="bh-star-badge-wrap">
                                <svg viewBox="0 0 24 24">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                                <span>钻卡</span>
                            </div>
                        </div>
                        <div class="bh-user-plan-name">5G 畅享融合套餐</div>
                    </div>
                </div>

                <!-- 聚焦话费大卡片 -->
                <div class="bh-balance-hero-card">
                    <div class="bh-balance-info">
                        <div class="bh-balance-title">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <line x1="12" y1="10" x2="12" y2="14"/>
                                <line x1="8" y1="12" x2="16" y2="12"/>
                            </svg>
                            当前可用余额
                        </div>
                        <div class="bh-balance-amount">¥<span id="bhBalanceText">30.00</span></div>
                        <div class="bh-balance-status">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            正常在网 • 无欠费
                        </div>
                    </div>
                    <div class="bh-balance-action-btn" onclick="BusinessApp.openRechargeDrawer()">
                        充值
                    </div>
                </div>
            </div>

            <!-- 账单明细分析区 -->
            <div class="bh-bill-section">
                <div class="bh-section-header">
                    <div class="bh-section-title">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                        </svg>
                        账单明细分析
                    </div>
                </div>

                <!-- 分段选择器 -->
                <div class="bh-bill-segment">
                    <div class="bh-bill-segment-btn active" onclick="BusinessApp.switchBillTab('daily')">每日账单</div>
                    <div class="bh-bill-segment-btn" onclick="BusinessApp.switchBillTab('weekly')">每周账单</div>
                    <div class="bh-bill-segment-btn" onclick="BusinessApp.switchBillTab('monthly')">每月账单</div>
                </div>

                <!-- 每日账单 -->
                <div class="bh-bill-content-panel active" id="bh-bill-daily">
                    <div class="bh-bill-summary-box">
                        <span class="bh-bill-summary-label">今日预计扣费</span>
                        <span class="bh-bill-summary-value" id="bhTodayCostSummary">¥4.30</span>
                    </div>
                    <div class="bh-bill-list" id="bhDailyBillList">
                        <!-- 动态渲染日账单 -->
                    </div>
                </div>

                <!-- 每周账单 -->
                <div class="bh-bill-content-panel" id="bh-bill-weekly">
                    <div class="bh-weekly-chart-container" id="bhWeeklyChartBox">
                        <!-- 动态渲染 7 根真实消费柱状图 -->
                    </div>
                    <div class="bh-bill-summary-box">
                        <span class="bh-bill-summary-label">本周累计消费</span>
                        <span class="bh-bill-summary-value" id="bhWeeklyCostSummary">¥0.00</span>
                    </div>
                </div>

                <!-- 每月账单 -->
                <div class="bh-bill-content-panel" id="bh-bill-monthly">
                    <div class="bh-bill-summary-box">
                        <span class="bh-bill-summary-label">本月账单汇总</span>
                        <span class="bh-bill-summary-value" id="bhMonthlyCostSummary">¥0.00</span>
                    </div>
                    <div class="bh-bill-list" id="bhMonthlyBillList">
                        <!-- 动态渲染月账单 -->
                    </div>
                </div>
            </div>

            <!-- 充值抽屉弹窗 (Bottom Sheet) -->
            <div class="bh-drawer-overlay" id="bhRechargeDrawer" onclick="BusinessApp.closeRechargeDrawer(event)">
                <div class="bh-drawer-sheet" onclick="event.stopPropagation()">
                    <div class="bh-drawer-handle"></div>
                    <div class="bh-drawer-header">
                        <div class="bh-drawer-title">话费充值</div>
                        <div class="bh-drawer-close" onclick="BusinessApp.closeRechargeDrawer()">
                            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                    </div>
                    <div class="bh-recharge-grid">
                        <div class="bh-recharge-item" onclick="BusinessApp.selectRecharge(this, 30, 29.85)">
                            <div class="bh-recharge-amount">30元</div>
                            <div class="bh-recharge-price">售价¥29.85</div>
                        </div>
                        <div class="bh-recharge-item active" onclick="BusinessApp.selectRecharge(this, 50, 49.75)">
                            <span class="bh-recharge-discount-tag">9.95折</span>
                            <div class="bh-recharge-amount">50元</div>
                            <div class="bh-recharge-price">售价¥49.75</div>
                        </div>
                        <div class="bh-recharge-item" onclick="BusinessApp.selectRecharge(this, 100, 99.50)">
                            <span class="bh-recharge-discount-tag">特惠</span>
                            <div class="bh-recharge-amount">100元</div>
                            <div class="bh-recharge-price">售价¥99.50</div>
                        </div>
                        <div class="bh-recharge-item" onclick="BusinessApp.selectRecharge(this, 200, 199.00)">
                            <div class="bh-recharge-amount">200元</div>
                            <div class="bh-recharge-price">售价¥199.00</div>
                        </div>
                        <div class="bh-recharge-item" onclick="BusinessApp.selectRecharge(this, 300, 298.50)">
                            <div class="bh-recharge-amount">300元</div>
                            <div class="bh-recharge-price">售价¥298.50</div>
                        </div>
                        <div class="bh-recharge-item" onclick="BusinessApp.selectCustomRecharge(this)">
                            <div class="bh-recharge-amount">自定义</div>
                            <div class="bh-recharge-price">输入金额</div>
                        </div>
                    </div>
                    <button class="bh-recharge-btn-submit" id="bhPayBtn" onclick="BusinessApp.doRecharge()">
                        <svg viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                        </svg>
                        立即支付 ¥49.75 (Apple Pay)
                    </button>
                </div>
            </div>
        `;
        wechatUI.appendChild(page);
    }

    // 渲染账单面板（日/周/月）
    function renderBills() {
        // 1. 更新话费余额
        const balEl = document.getElementById('bhBalanceText');
        if (balEl) balEl.innerText = Number(businessData.balance || 0).toFixed(2);

        // 2. 渲染日账单列表
        const dailyContainer = document.getElementById('bhDailyBillList');
        const todayCostSummary = document.getElementById('bhTodayCostSummary');
        let todayCost = 0;
        const now = new Date();

        if (dailyContainer) {
            if (businessData.bills.length === 0) {
                dailyContainer.innerHTML = '<div style="text-align: center; color: #8E8E93; font-size: 13px; padding: 24px 0;">暂无账单明细</div>';
            } else {
                dailyContainer.innerHTML = businessData.bills.map(b => {
                    const isIncome = b.type === 'recharge';
                    const isToday = new Date(b.time).toDateString() === now.toDateString();
                    if (isToday && !isIncome) todayCost += Number(b.amount || 0);

                    const iconSvg = isIncome
                        ? `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`
                        : `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

                    return `
                        <div class="bh-bill-item">
                            <div class="bh-bill-item-left">
                                <div class="bh-bill-icon-box ${isIncome ? 'income' : ''}">
                                    ${iconSvg}
                                </div>
                                <div class="bh-bill-item-info">
                                    <div class="bh-bill-item-title">${b.title}</div>
                                    <div class="bh-bill-item-time">${formatTime(b.time)}</div>
                                </div>
                            </div>
                            <div class="bh-bill-item-right">
                                <div class="bh-bill-item-cost ${isIncome ? 'income' : ''}">${isIncome ? '+' : '-'}¥${Number(b.amount).toFixed(2)}</div>
                                <div class="bh-bill-item-status">${isIncome ? '充值成功' : '已扣除'}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        if (todayCostSummary) todayCostSummary.innerText = `¥${todayCost.toFixed(2)}`;

        // 3. 动态渲染周账单柱状图
        const weeklyContainer = document.getElementById('bhWeeklyChartBox');
        const weeklyCostSummary = document.getElementById('bhWeeklyCostSummary');
        if (weeklyContainer) {
            const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            const dayAmounts = [0, 0, 0, 0, 0, 0, 0];
            let weekTotal = 0;

            const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = 周一, 6 = 周日
            const mondayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayOfWeek).getTime();

            businessData.bills.forEach(b => {
                if (b.type !== 'recharge' && b.time >= mondayTime) {
                    const billDate = new Date(b.time);
                    const dayIdx = (billDate.getDay() + 6) % 7;
                    dayAmounts[dayIdx] += Number(b.amount || 0);
                    weekTotal += Number(b.amount || 0);
                }
            });

            const maxAmount = Math.max(...dayAmounts, 10);
            weeklyContainer.innerHTML = dayAmounts.map((amt, idx) => {
                const heightPx = Math.max(4, Math.round((amt / maxAmount) * 75));
                return `
                    <div class="bh-chart-bar-wrap">
                        <div class="bh-chart-bar" style="height: ${heightPx}px;"><span class="bh-chart-bar-value">¥${amt.toFixed(1)}</span></div>
                        <span class="bh-chart-bar-label">${weekDays[idx]}</span>
                    </div>
                `;
            }).join('');

            if (weeklyCostSummary) weeklyCostSummary.innerText = `¥${weekTotal.toFixed(2)}`;
        }

        // 4. 动态渲染月账单列表
        const monthlyContainer = document.getElementById('bhMonthlyBillList');
        const monthlyCostSummary = document.getElementById('bhMonthlyCostSummary');
        if (monthlyContainer) {
            let monthTotal = 0;
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const monthBills = businessData.bills.filter(b => {
                const bd = new Date(b.time);
                return bd.getMonth() === currentMonth && bd.getFullYear() === currentYear;
            });

            monthBills.forEach(b => {
                if (b.type !== 'recharge') monthTotal += Number(b.amount || 0);
            });

            if (monthBills.length === 0) {
                monthlyContainer.innerHTML = '<div style="text-align: center; color: #8E8E93; font-size: 13px; padding: 24px 0;">本月暂无账单</div>';
            } else {
                monthlyContainer.innerHTML = monthBills.map(b => {
                    const isIncome = b.type === 'recharge';
                    return `
                        <div class="bh-bill-item">
                            <div class="bh-bill-item-left">
                                <div class="bh-bill-icon-box ${isIncome ? 'income' : ''}">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                </div>
                                <div class="bh-bill-item-info">
                                    <div class="bh-bill-item-title">${b.title}</div>
                                    <div class="bh-bill-item-time">${formatTime(b.time)}</div>
                                </div>
                            </div>
                            <div class="bh-bill-item-right">
                                <div class="bh-bill-item-cost ${isIncome ? 'income' : ''}">${isIncome ? '+' : '-'}¥${Number(b.amount).toFixed(2)}</div>
                                <div class="bh-bill-item-status">${isIncome ? '充值成功' : '已扣费'}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            if (monthlyCostSummary) monthlyCostSummary.innerText = `¥${monthTotal.toFixed(2)}`;
        }
    }

    // 4. 业务方法集合
    let bhPreviousSource = 'wallet';
    let bhPreviousWechatPage = 'page-wallet';
    let bhWechatWasHidden = false;
    let bhMessageWasVisible = false;

    const BusinessApp = {
        open: async function (options = {}) {
            ensurePageDOM();
            const wechatUI = document.getElementById('wechatAppUI');
            if (!wechatUI) return;

            bhPreviousSource = options?.source || 'wallet';

            if (bhPreviousSource === 'message') {
                const messageUI = document.getElementById('messageAppUI');
                bhMessageWasVisible = !!messageUI && window.getComputedStyle(messageUI).display !== 'none';
                if (messageUI) messageUI.style.display = 'none';
                bhWechatWasHidden = (wechatUI.style.display === 'none' || !wechatUI.classList.contains('show'));
                wechatUI.style.display = 'block';
                wechatUI.classList.add('show');
            } else {
                bhMessageWasVisible = false;
                bhWechatWasHidden = false;
                const activePage = wechatUI.querySelector('.page.active');
                if (activePage && activePage.id !== 'page-business-hall') {
                    bhPreviousWechatPage = activePage.id;
                }
            }

            const bottomNav = wechatUI.querySelector('.bottom-nav-wrapper');
            if (bottomNav) bottomNav.style.display = 'none';

            wechatUI.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const page = document.getElementById('page-business-hall');
            if (page) page.classList.add('active');

            const phone = await getRealUserPhone();
            const phoneEl = document.getElementById('bhUserPhoneDisplay');
            if (phoneEl) {
                phoneEl.innerText = phone.length === 11 ? `${phone.slice(0, 3)} •••• ${phone.slice(-4)}` : phone;
            }

            if (typeof wcLoadWalletData === 'function') {
                await wcLoadWalletData();
            }
            await loadBusinessData();
            renderBills();
        },

        close: function () {
            const wechatUI = document.getElementById('wechatAppUI');
            if (!wechatUI) return;

            const page = document.getElementById('page-business-hall');
            if (page) page.classList.remove('active');

            if (bhPreviousSource === 'message') {
                if (bhWechatWasHidden) {
                    wechatUI.classList.remove('show');
                    setTimeout(() => {
                        wechatUI.style.display = 'none';
                    }, 200);
                }
                const msgAppUI = document.getElementById('messageAppUI');
                if (msgAppUI && bhMessageWasVisible) {
                    msgAppUI.style.display = 'flex';
                }
            } else {
                wechatUI.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                const prevTarget = document.getElementById(bhPreviousWechatPage) || document.getElementById('page-wallet');
                if (prevTarget) {
                    prevTarget.classList.add('active');
                } else {
                    const chatListPage = document.getElementById('page-chat-list');
                    if (chatListPage) chatListPage.classList.add('active');
                }
            }
        },

        openRechargeDrawer: function () {
            const drawer = document.getElementById('bhRechargeDrawer');
            if (drawer) drawer.classList.add('show');
        },

        closeRechargeDrawer: function (event) {
            if (event && event.target !== document.getElementById('bhRechargeDrawer')) return;
            const drawer = document.getElementById('bhRechargeDrawer');
            if (drawer) drawer.classList.remove('show');
        },

        selectRecharge: function (el, amount, price) {
            document.querySelectorAll('#wechatAppUI .bh-recharge-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
            selectedAmount = amount;
            selectedPrice = price;
            const payBtn = document.getElementById('bhPayBtn');
            if (payBtn) {
                payBtn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                    </svg>
                    立即支付 ¥${price.toFixed(2)} (Apple Pay)
                `;
            }
        },

        selectCustomRecharge: function (el) {
            const promptFunc = typeof showCustomPrompt === 'function' ? showCustomPrompt : (title, opt) => Promise.resolve(window.prompt(title, opt?.value || '100'));
            promptFunc('话费充值', { placeholder: '请输入充值金额（元）', value: '100' }, '确定').then(val => {
                const parsed = parseFloat(val);
                if (parsed && parsed > 0) {
                    document.querySelectorAll('#wechatAppUI .bh-recharge-item').forEach(i => i.classList.remove('active'));
                    el.classList.add('active');
                    selectedAmount = parsed;
                    selectedPrice = parsed * 0.995;
                    const payBtn = document.getElementById('bhPayBtn');
                    if (payBtn) {
                        payBtn.innerHTML = `
                            <svg viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                            </svg>
                            立即支付 ¥${selectedPrice.toFixed(2)} (Apple Pay)
                        `;
                    }
                }
            });
        },

        doRecharge: function () {
            if (typeof wcWalletData === 'undefined') {
                if (typeof showToast === 'function') showToast('钱包服务尚未就绪');
                return;
            }

            let totalAvailable = wcWalletData.balance || 0;
            if (Array.isArray(wcWalletData.familyCards)) {
                wcWalletData.familyCards.forEach(fc => {
                    if (fc.role !== 'sender') {
                        totalAvailable += (fc.amount || 0);
                    }
                });
            }

            if (totalAvailable < selectedPrice) {
                if (typeof showToast === 'function') {
                    showToast('微信钱包余额不足，请先在钱包充值零钱');
                } else {
                    alert('微信钱包余额不足，请先在钱包充值零钱');
                }
                return;
            }

            BusinessApp.closeRechargeDrawer();

            if (typeof wcOpenApplePay === 'function') {
                wcOpenApplePay({
                    payee: '中国移动 · 话费充值',
                    amount: selectedPrice,
                    title: `话费充值 (${selectedAmount}元)`,
                    onSuccess: async () => {
                        const now = Date.now();

                        businessData.balance = Number((businessData.balance + selectedAmount).toFixed(2));
                        businessData.bills.unshift({
                            id: 'bill_' + now,
                            title: `话费充值 (${selectedAmount}元)`,
                            type: 'recharge',
                            amount: selectedAmount,
                            time: now
                        });
                        await saveBusinessData();
                        renderBills();

                        const d = new Date(now);
                        const pad = (n) => String(n).padStart(2, '0');
                        const smsText = `【中国移动】尊敬的客户：您于${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}通过微信支付成功充值话费${selectedAmount.toFixed(2)}元。当前话费可用余额为${businessData.balance.toFixed(2)}元。感谢您的支持！`;
                        
                        if (window.MessageApp && typeof window.MessageApp.receiveMessage === 'function') {
                            await window.MessageApp.receiveMessage('10086', smsText);
                        }

                        if (typeof showToast === 'function') {
                            showToast(`充值成功！已扣除零钱 ¥${selectedPrice.toFixed(2)} 元`);
                        }
                    }
                });
            }
        },


        switchBillTab: function (tabId) {
            const btns = document.querySelectorAll('#wechatAppUI .bh-bill-segment-btn');
            const panels = document.querySelectorAll('#wechatAppUI .bh-bill-content-panel');

            btns.forEach(btn => {
                const matches = (tabId === 'daily' && btn.innerText.includes('日')) ||
                                (tabId === 'weekly' && btn.innerText.includes('周')) ||
                                (tabId === 'monthly' && btn.innerText.includes('月'));
                btn.classList.toggle('active', matches);
            });

            panels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `bh-bill-${tabId}`);
            });
        }
    };

    // 挂载到全局对象
    window.BusinessApp = BusinessApp;
})();

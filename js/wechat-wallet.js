// WeChat wallet, transfer, Apple Pay, and family cards. Extracted without behavior changes.

    // ==========================================
    // 微信钱包页面逻辑
    // ==========================================

    // 钱包数据状态 (初始为空)
    let wcWalletData = {
        balance: 0.00,
        transactions: [],
        groupRedPacketSettlements: {}, // Account-scoped idempotency keys for group packet settlements.
        familyCards: [], // 亲属卡数组
        isNoPwd: false,  // 免密支付状态
        payPassword: '123456', // 独立支付密码，默认123456
        isPayPasswordSet: false, // 是否已设置过支付密码
        cardTheme: 'luxury', // 当前卡片装扮主题：'luxury' | 'cute' | 'korean' | 'custom_xxx'
        customCardCss: '', // 自定义卡片 CSS
        customCardPresets: [] // 保存的自定义卡片预设数组
    };

    // 从 IndexedDB 读取钱包数据
    async function wcLoadWalletData() {
        try {
            const accountId = wcGetCurrentAccountId();
            const data = await wcReadLayoutRecord(`wechatWalletData_${accountId}`);
            if (accountId !== wcGetCurrentAccountId()) return;
            if (data) {
                wcWalletData.balance = data.balance || 0.00;
                wcWalletData.transactions = data.transactions || [];
                wcWalletData.groupRedPacketSettlements = data.groupRedPacketSettlements || {};
                wcWalletData.familyCards = data.familyCards || [];
                wcWalletData.isNoPwd = data.isNoPwd || false;
                wcWalletData.payPassword = data.payPassword || '123456';
                wcWalletData.isPayPasswordSet = data.isPayPasswordSet !== undefined ? data.isPayPasswordSet : (!!data.payPassword && data.payPassword !== '123456');
                wcWalletData.cardTheme = data.cardTheme || 'luxury';
                wcWalletData.customCardCss = data.customCardCss || '';
                wcWalletData.customCardPresets = data.customCardPresets || [];
            } else {
                // 如果数据库中没有数据，设置默认初始值
                wcWalletData.balance = 0.00;
                wcWalletData.transactions = [];
                wcWalletData.groupRedPacketSettlements = {};
                wcWalletData.familyCards = [];
                wcWalletData.isNoPwd = false;
                wcWalletData.payPassword = '123456';
                wcWalletData.isPayPasswordSet = false;
                wcWalletData.cardTheme = 'luxury';
                wcWalletData.customCardCss = '';
                wcWalletData.customCardPresets = [];
            }
        } catch (e) {
            console.error('读取钱包数据失败', e);
        }
    }

    // Build the existing wallet record for both regular and atomic saves.
    function wcBuildWalletRecord(accountId = wcGetCurrentAccountId()) {
        return {
            id: `wechatWalletData_${accountId}`,
            balance: wcWalletData.balance,
            transactions: wcWalletData.transactions,
            groupRedPacketSettlements: wcWalletData.groupRedPacketSettlements || {},
            familyCards: wcWalletData.familyCards,
            isNoPwd: wcWalletData.isNoPwd,
            payPassword: wcWalletData.payPassword || '123456',
            isPayPasswordSet: !!wcWalletData.isPayPasswordSet,
            cardTheme: wcWalletData.cardTheme || 'luxury',
            customCardCss: wcWalletData.customCardCss || '',
            customCardPresets: wcWalletData.customCardPresets || []
        };
    }

    // Save wallet data to IndexedDB.
    function wcSaveWalletData() {
        if (!db || typeof storeName === 'undefined') return Promise.reject(new Error('数据库尚未准备好'));
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            transaction.objectStore(storeName).put(wcBuildWalletRecord());
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    function wcFormatWalletTransactionDate(tx) {
        const candidate = Number(tx?.createdAt ?? tx?.timestamp ?? tx?.id);
        const timestamp = Number.isFinite(candidate) && candidate >= 946684800000 && candidate < 4102444800000
            ? candidate
            : Date.parse(tx?.date || '');
        if (!Number.isFinite(timestamp)) {
            return typeof tx?.date === 'string' && tx.date !== '刚刚' ? tx.date : '时间未知';
        }
        const date = new Date(timestamp);
        const pad = value => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function wcFormatTransferTime(value, fallback = '时间未知') {
        const date = new Date(value);
        if (!value || !Number.isFinite(date.getTime())) return fallback;
        const pad = number => String(number).padStart(2, '0');
        return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日 ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 渲染钱包数据
    function wcRenderWallet() {
        // 1. 更新余额
        const balanceEl = document.getElementById('wcWalletBalance');
        if (balanceEl) {
            balanceEl.innerText = wcWalletData.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // 2. 渲染卡片 (动态生成银行卡和亲属卡，银行卡无需显示额度余额)
        const cardsScroll = document.getElementById('wcWalletCardsScroll');
        const dotsContainer = document.getElementById('wcWalletDots');

        // 应用主题类
        const walletPage = document.getElementById('page-wallet');
        if (walletPage) {
            walletPage.classList.remove('theme-luxury', 'theme-cute', 'theme-korean');
            if (['luxury', 'cute', 'korean'].includes(wcWalletData.cardTheme)) {
                walletPage.classList.add(`theme-${wcWalletData.cardTheme}`);
            }
        }
        wcApplyWalletCustomStyleTag(wcWalletData.customCardCss || '');

        if (cardsScroll && dotsContainer) {
            // 获取当前主题对应的真实矢量装饰背景 SVG
            const patternSvg = wcGetCardDecorPatternSvg(wcWalletData.cardTheme);

            // 银行卡严格去除额度与余额，显示金属芯片与高阶卡片质感
            let cardsHtml = `
                <div class="wc-apple-card wc-cash-card">
                    ${patternSvg}
                    <div class="wc-card-content-layer">
                        <div class="wc-card-logo">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.223 14.38c-.358.548-1.025.702-1.573.344-1.636-1.07-3.696-1.31-6.12-.717-.62.15-1.25-.23-1.4-.85-.15-.62.23-1.25.85-1.4 2.78-.68 5.15-.39 7.04.84.548.358.702 1.025.344 1.573zm1.14-2.56c-.45.73-1.42.94-2.15.49-1.96-1.2-4.98-1.54-7.18-.84-.82.25-1.68-.2-1.93-1.02-.25-.82.2-1.68 1.02-1.93 2.6-0.82 6.06-0.43 8.38 1.01.73.45.94 1.42.49 2.15zm.1-2.67c-2.38-1.42-6.3-1.55-8.58-.86-.98.29-2.03-.26-2.32-1.24-.29-.98.26-2.03 1.24-2.32 2.7-0.81 7.18-0.65 9.98 1.02.89.53 1.18 1.68.65 2.57-.53.89-1.68 1.18-2.57.65z"/></svg>
                            Platinum Debit
                        </div>
                        <div style="display: flex; align-items: center; justify-content: flex-start; padding: 10px 0;">
                            <div class="wc-chip-visual"></div>
                        </div>
                        <div class="wc-card-bottom">
                            <div class="wc-card-number">•••• •••• •••• 3022</div>
                            <div class="wc-card-network">VISA</div>
                        </div>
                    </div>
                </div>
            `;
            let dotsHtml = `<div class="wc-dot active"></div>`;

            if (wcWalletData.familyCards && wcWalletData.familyCards.length > 0) {
                wcWalletData.familyCards.forEach(card => {
                    const isSender = card.role === 'sender';
                    const labelText = isSender ? '本月赠送额度' : '本月可用额度';
                    const displayName = card.name.includes('赠予') || card.name.includes('来自')
                        ? card.name
                        : (isSender ? '赠予: ' : '来自: ') + card.name.replace('亲属卡 (', '').replace(')', '');

                    cardsHtml += `
                        <div class="wc-apple-card wc-family-card" style="background: ${card.bg};">
                            ${patternSvg}
                            <div class="wc-card-content-layer">
                                <div class="wc-card-logo">
                                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    亲属卡
                                </div>
                                <div class="wc-card-balance-area">
                                    <div class="wc-card-balance-label">${labelText}</div>
                                    <div class="wc-card-balance-amount">¥ ${card.amount ? card.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '3,000.00'}</div>
                                </div>
                                <div class="wc-card-bottom">
                                    <div class="wc-card-number">${displayName}</div>
                                    <div class="wc-card-network">${card.type}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    dotsHtml += `<div class="wc-dot"></div>`;
                });
            }

            cardsScroll.innerHTML = cardsHtml;
            dotsContainer.innerHTML = dotsHtml;
        }

        // 3. 渲染交易记录 (主页仅展示最新 5 条)
        const txListEl = document.getElementById('wcTxList');
        if (!txListEl) return;

        if (wcWalletData.transactions.length === 0) {
            txListEl.innerHTML = '<div style="text-align:center; padding: 24px 0; color: #8e8e93; font-size: 14px;">暂无交易记录</div>';
            return;
        }

        const latestTransactions = wcWalletData.transactions.slice(0, 5);
        let html = '';
        latestTransactions.forEach(tx => {
            let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;"><path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM13.0049 13.0027H16.0049V15.0027H13.0049V17.0027H11.0049V15.0027H8.00488V13.0027H11.0049V12.0027H8.00488V10.0027H10.5907L8.46935 7.88143L9.88356 6.46721L12.0049 8.58853L14.1262 6.46721L15.5404 7.88143L13.4191 10.0027H16.0049V12.0027H13.0049V13.0027Z"></path></svg>`;

            const amountClass = tx.type === 'income' ? 'wc-income' : '';
            const amountPrefix = tx.type === 'income' ? '+ ¥ ' : '- ¥ ';
            const amountStr = amountPrefix + tx.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            html += `
                <div class="wc-tx-item">
                    <div class="wc-tx-icon">${svgIcon}</div>
                    <div class="wc-tx-info">
                        <div class="wc-tx-name">${tx.title}</div>
                        <div class="wc-tx-status">已完成</div>
                    </div>
                    <div class="wc-tx-amount-area">
                        <div class="wc-tx-amount ${amountClass}">${amountStr}</div>
                        <div class="wc-tx-date">${wcFormatWalletTransactionDate(tx)}</div>
                    </div>
                </div>
            `;
        });
        txListEl.innerHTML = html;
    }

    // 打开全部交易记录页面
    function wcOpenAllTransactionsPage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        const page = document.getElementById('page-wallet-transactions');
        if (page) page.classList.add('active');
        wcRenderAllTransactionsPage();
    }
    window.wcOpenAllTransactionsPage = wcOpenAllTransactionsPage;

    // 关闭全部交易记录页面返回钱包主页
    function wcCloseAllTransactionsPage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        const wallet = document.getElementById('page-wallet');
        if (wallet) wallet.classList.add('active');
    }
    window.wcCloseAllTransactionsPage = wcCloseAllTransactionsPage;

    // 控制明细卡片金额显示/隐藏状态
    let wcIsTxAmountVisible = true;

    function wcToggleTransactionAmountVisibility() {
        wcIsTxAmountVisible = !wcIsTxAmountVisible;
        const eyeIcon = document.getElementById('wcTxEyeIcon');
        if (eyeIcon) {
            if (wcIsTxAmountVisible) {
                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            } else {
                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            }
        }
        wcRenderAllTransactionsPage();
    }
    window.wcToggleTransactionAmountVisibility = wcToggleTransactionAmountVisibility;

    // 渲染全部交易记录页面 (包含总支出、总收入与预算结余统计)
    function wcRenderAllTransactionsPage() {
        const container = document.getElementById('wcAllTxListContent');
        const expenseEl = document.getElementById('wcTxTotalExpense');
        const incomeEl = document.getElementById('wcTxTotalIncome');
        const surplusEl = document.getElementById('wcTxTotalSurplus');

        let totalExpense = 0;
        let totalIncome = 0;

        (wcWalletData.transactions || []).forEach(tx => {
            if (tx.type === 'income') {
                totalIncome += Number(tx.amount) || 0;
            } else {
                totalExpense += Number(tx.amount) || 0;
            }
        });

        const totalSurplus = Math.max(0, totalIncome - totalExpense);

        if (expenseEl) {
            expenseEl.innerText = wcIsTxAmountVisible
                ? '¥ ' + totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '¥ ****';
        }
        if (incomeEl) {
            incomeEl.innerText = wcIsTxAmountVisible
                ? '本月收入 ¥ ' + totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '本月收入 ¥ ****';
        }
        if (surplusEl) {
            surplusEl.innerText = wcIsTxAmountVisible
                ? '¥ ' + totalSurplus.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '¥ ****';
        }

        if (!container) return;

        if (!wcWalletData.transactions || wcWalletData.transactions.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 40px 0; color: #8e8e93; font-size: 14px;">暂无交易记录</div>';
            return;
        }

        let html = '<div class="wc-ws-group" style="background: #ffffff; border-radius: 16px; padding: 0 16px; border: 1px solid #F0F0F4; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">';
        wcWalletData.transactions.forEach(tx => {
            let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;"><path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM13.0049 13.0027H16.0049V15.0027H13.0049V17.0027H11.0049V15.0027H8.00488V13.0027H11.0049V12.0027H8.00488V10.0027H10.5907L8.46935 7.88143L9.88356 6.46721L12.0049 8.58853L14.1262 6.46721L15.5404 7.88143L13.4191 10.0027H16.0049V12.0027H13.0049V13.0027Z"></path></svg>`;

            const amountClass = tx.type === 'income' ? 'wc-income' : '';
            const amountPrefix = tx.type === 'income' ? '+ ¥ ' : '- ¥ ';
            const amountStr = amountPrefix + tx.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            html += `
                <div class="wc-tx-item">
                    <div class="wc-tx-icon">${svgIcon}</div>
                    <div class="wc-tx-info">
                        <div class="wc-tx-name">${tx.title}</div>
                        <div class="wc-tx-status">已完成</div>
                    </div>
                    <div class="wc-tx-amount-area">
                        <div class="wc-tx-amount ${amountClass}">${amountStr}</div>
                        <div class="wc-tx-date">${wcFormatWalletTransactionDate(tx)}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    async function wcOpenWallet() {
        const profile = document.getElementById('page-profile');
        const wallet = document.getElementById('page-wallet');
        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');

        if (wallet) {
            document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
            wallet.classList.add('active');

            await wcLoadWalletData();
            wcRenderWallet();
        }
        if (bottomNav) {
            bottomNav.style.display = 'none';
        }
    }
    window.wcOpenWallet = wcOpenWallet;

    function wcCloseWallet() {
        const profile = document.getElementById('page-profile');
        const wallet = document.getElementById('page-wallet');
        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');

        if (profile) {
            document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
            profile.classList.add('active');
        }
        if (bottomNav) {
            bottomNav.style.display = 'block';
        }
    }
    window.wcCloseWallet = wcCloseWallet;

    function wcUpdateWalletDots() {
        const scrollContainer = document.getElementById('wcWalletCardsScroll');
        const dots = document.querySelectorAll('#wcWalletDots .wc-dot');
        if (!scrollContainer || dots.length === 0) return;

        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = scrollContainer.offsetWidth;
        const index = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    window.wcUpdateWalletDots = wcUpdateWalletDots;
    // 当前亲属卡列表查看标签：'received' (收到) 或 'sent' (送出)
    let wcFamilyCardCurrentTab = 'received';

    // 切换收到/送出分栏
    function wcSwitchFamilyCardListTab(tab) {
        wcFamilyCardCurrentTab = tab;
        const slider = document.getElementById('wcFamilyCardListTabSlider');
        const tabReceived = document.getElementById('wcFcTabReceived');
        const tabSent = document.getElementById('wcFcTabSent');

        if (slider) {
            slider.style.transform = tab === 'received' ? 'translateX(0)' : 'translateX(100%)';
        }
        if (tabReceived && tabSent) {
            tabReceived.classList.toggle('active', tab === 'received');
            tabSent.classList.toggle('active', tab === 'sent');
        }
        wcRenderFamilyCardList();
    }
    window.wcSwitchFamilyCardListTab = wcSwitchFamilyCardListTab;

    // 打开亲属卡列表页面
    function wcOpenFamilyCardList() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-family-cards').classList.add('active');
        wcFamilyCardCurrentTab = 'received';
        const slider = document.getElementById('wcFamilyCardListTabSlider');
        const tabReceived = document.getElementById('wcFcTabReceived');
        const tabSent = document.getElementById('wcFcTabSent');
        if (slider) slider.style.transform = 'translateX(0)';
        if (tabReceived) tabReceived.classList.add('active');
        if (tabSent) tabSent.classList.remove('active');
        wcRenderFamilyCardList();
    }
    window.wcOpenFamilyCardList = wcOpenFamilyCardList;

    // 关闭亲属卡列表页面
    function wcCloseFamilyCardList() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-wallet').classList.add('active');
    }
    window.wcCloseFamilyCardList = wcCloseFamilyCardList;

    // 渲染亲属卡列表
    function wcRenderFamilyCardList() {
        const container = document.getElementById('wcFamilyCardListContent');
        if (!container) return;

        const allCards = wcWalletData.familyCards || [];
        const isSentTab = wcFamilyCardCurrentTab === 'sent';
        const displayCards = allCards.filter(card => isSentTab ? card.role === 'sender' : card.role !== 'sender');

        if (displayCards.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding: 40px 0; color: #8e8e93; font-size: 14px;">${isSentTab ? '暂无送出的亲属卡' : '暂无收到的亲属卡'}</div>`;
            return;
        }

        let html = '<div class="wc-ws-group" style="background: transparent; box-shadow: none;">';
        displayCards.forEach((card) => {
            const labelText = isSentTab ? '本月赠送额度' : '本月可用额度';
            const actionText = isSentTab ? '收回卡片' : '解除绑定';
            const displayName = card.name.includes('赠予') || card.name.includes('来自')
                ? card.name
                : (isSentTab ? '赠予: ' : '来自: ') + card.name.replace('亲属卡 (', '').replace(')', '');

            html += `
                <div class="wc-apple-card wc-family-card" style="background: ${card.bg}; margin-bottom: 16px; width: 100%; max-width: 100%; aspect-ratio: 1.586 / 1; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                    <div class="wc-card-logo" style="color: ${card.logoColor}; display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 700;">
                        <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: ${card.logoColor};"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        亲属卡
                    </div>
                    <div class="wc-card-balance-area" style="text-align: center; color: ${card.logoColor};">
                        <div class="wc-card-balance-label" style="font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #BCC4CE;">${labelText}</div>
                        <div class="wc-card-balance-amount" style="font-size: 38px; font-weight: 600; letter-spacing: -1px;">¥ ${card.amount ? card.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '3,000.00'}</div>
                    </div>
                    <div class="wc-card-bottom" style="display: flex; justify-content: space-between; align-items: flex-end; color: #BCC4CE;">
                        <div class="wc-card-number" style="font-size: 15px; font-family: monospace; letter-spacing: 2px;">${displayName}</div>
                        <div class="wc-card-network" style="font-size: 14px; font-weight: 700; font-style: italic; color: #7B8AA0;">${card.type}</div>
                    </div>
                    <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
                        <button onclick="wcUnbindFamilyCard('${card.id}')" style="background: rgba(255,255,255,0.2); border: none; color: ${card.logoColor}; padding: 6px 16px; border-radius: 14px; font-size: 13px; font-weight: 600; cursor: pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">${actionText}</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    window.wcUnbindFamilyCard = function(cardId) {
        const targetCard = (wcWalletData.familyCards || []).find(c => c.id === cardId);
        const isSent = targetCard && targetCard.role === 'sender';
        const title = isSent ? '收回卡片' : '解除绑定';
        const msg = isSent ? '确定要收回这张送出的亲属卡吗？' : '确定要解除绑定这张亲属卡吗？';
        const btnText = isSent ? '收回' : '解除';

        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm(title, msg, btnText, true).then(confirmed => {
                if (confirmed) {
                    wcWalletData.familyCards = wcWalletData.familyCards.filter(c => c.id !== cardId);
                    wcSaveWalletData();
                    wcRenderFamilyCardList();
                    if (typeof showToast === 'function') showToast(isSent ? '已收回亲属卡' : '已解除绑定');
                }
            });
        }
    };

    // 打开支付设置页面
    function wcOpenWalletSettings() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-wallet-settings').classList.add('active');

        // 初始化免密开关状态
        const toggle = document.getElementById('wcRealNoPwdToggle');
        if (toggle) {
            if (wcWalletData.isNoPwd) toggle.classList.add('active');
            else toggle.classList.remove('active');
        }

        // 初始化设置支付密码状态（已设置/未设置）
        const setPwdItem = document.querySelector('#page-wallet-settings .wc-ws-item[onclick*="wcSetPaymentPassword"]');
        if (setPwdItem) {
            let rightBox = setPwdItem.querySelector('.wc-ws-item-right');
            const chevron = setPwdItem.querySelector('.wc-ws-chevron');
            if (!rightBox) {
                rightBox = document.createElement('div');
                rightBox.className = 'wc-ws-item-right';
                rightBox.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-left: auto;';
                if (chevron) {
                    setPwdItem.insertBefore(rightBox, chevron);
                    rightBox.appendChild(chevron);
                } else {
                    setPwdItem.appendChild(rightBox);
                }
            }
            let statusEl = rightBox.querySelector('.wc-set-pay-pwd-status');
            if (!statusEl) {
                statusEl = document.createElement('span');
                statusEl.className = 'wc-set-pay-pwd-status';
                rightBox.insertBefore(statusEl, rightBox.firstChild);
            }
            if (wcWalletData.isPayPasswordSet) {
                statusEl.style.cssText = 'font-size: 15px; color: #8e8e93; font-weight: 400;';
                statusEl.textContent = '已设置';
            } else {
                statusEl.style.cssText = 'font-size: 15px; color: #ff9500; font-weight: 500;';
                statusEl.textContent = '未设置';
            }
        }

    }
    window.wcOpenWalletSettings = wcOpenWalletSettings;

    // 关闭支付设置页面，返回钱包
    function wcCloseWalletSettings() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-wallet').classList.add('active');
    }
    window.wcCloseWalletSettings = wcCloseWalletSettings;

    // 切换免密支付状态
    function wcToggleNoPwd() {
        const toggle = document.getElementById('wcRealNoPwdToggle');
        if (toggle) {
            toggle.classList.toggle('active');
            wcWalletData.isNoPwd = toggle.classList.contains('active');
            wcSaveWalletData();
            if(typeof showToast === 'function') showToast(wcWalletData.isNoPwd ? '已开启免密支付' : '已关闭免密支付');
        }
    }
    window.wcToggleNoPwd = wcToggleNoPwd;

    // 打开支付密码修改全屏页面
    function wcOpenWechatChangePayPwdPage() {
        const page = document.getElementById('page-wechat-change-pay-pwd');
        if (!page) return;

        const oldInput = document.getElementById('wcChangePayPwdOldInput');
        const newInput = document.getElementById('wcChangePayPwdNewInput');
        const confirmInput = document.getElementById('wcChangePayPwdConfirmInput');

        if (oldInput) oldInput.value = '';
        if (newInput) newInput.value = '';
        if (confirmInput) confirmInput.value = '';

        wcCheckChangePayPwdValidation();

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    }
    window.wcOpenWechatChangePayPwdPage = wcOpenWechatChangePayPwdPage;

    function wcCloseWechatChangePayPwdPage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        const walletSettingsPage = document.getElementById('page-wallet-settings');
        if (walletSettingsPage) {
            walletSettingsPage.classList.add('active');
            wcOpenWalletSettings();
        } else {
            document.getElementById('page-wallet').classList.add('active');
        }
    }
    window.wcCloseWechatChangePayPwdPage = wcCloseWechatChangePayPwdPage;

    function wcCheckChangePayPwdValidation() {
        const oldInput = document.getElementById('wcChangePayPwdOldInput');
        const newInput = document.getElementById('wcChangePayPwdNewInput');
        const confirmInput = document.getElementById('wcChangePayPwdConfirmInput');
        const submitBtn = document.getElementById('wcChangePayPwdSubmitBtn');

        if (oldInput) oldInput.value = oldInput.value.replace(/\D/g, '').slice(0, 6);
        if (newInput) newInput.value = newInput.value.replace(/\D/g, '').slice(0, 6);
        if (confirmInput) confirmInput.value = confirmInput.value.replace(/\D/g, '').slice(0, 6);

        const oldPwd = oldInput?.value || '';
        const newPwd = newInput?.value || '';
        const confirmPwd = confirmInput?.value || '';

        // 支付密码规则：严格6位纯数字
        const isLengthValid = /^\d{6}$/.test(newPwd);
        const ruleLenEl = document.getElementById('wcPayPwdRuleLen');
        if (ruleLenEl) ruleLenEl.classList.toggle('passed', isLengthValid);

        const canSubmit = oldPwd.length === 6 && isLengthValid && confirmPwd.length === 6;
        if (submitBtn) {
            submitBtn.disabled = !canSubmit;
            submitBtn.classList.toggle('active', canSubmit);
        }
    }
    window.wcCheckChangePayPwdValidation = wcCheckChangePayPwdValidation;

    async function wcSubmitChangePayPassword() {
        const oldPwd = document.getElementById('wcChangePayPwdOldInput')?.value || '';
        const newPwd = document.getElementById('wcChangePayPwdNewInput')?.value || '';
        const confirmPwd = document.getElementById('wcChangePayPwdConfirmInput')?.value || '';

        const currentPayPwd = wcWalletData.payPassword || '123456';
        if (oldPwd !== currentPayPwd) {
            showCustomAlert('提示', '原支付密码不正确');
            return;
        }

        if (newPwd !== confirmPwd) {
            showCustomAlert('提示', '两次输入的新支付密码不一致');
            return;
        }

        if (!/^\d{6}$/.test(newPwd)) {
            showCustomAlert('提示', '新支付密码必须为6位纯数字');
            return;
        }

        try {
            wcWalletData.payPassword = newPwd;
            wcWalletData.isPayPasswordSet = true;
            await wcSaveWalletData();
            showToast('支付密码修改成功');
            wcCloseWechatChangePayPwdPage();
        } catch (e) {
            console.error('修改支付密码失败', e);
            showToast('修改失败，请重试');
        }
    }
    window.wcSubmitChangePayPassword = wcSubmitChangePayPassword;

    // 真实支付密码设置弹窗状态管理 (两阶段 6 位数字输入)
    let wcSetPayPwdStage = 1; // 1: 首次输入, 2: 二次确认输入
    let wcFirstEnteredPayPwd = '';
    let wcCurrentEnteredPayPwd = '';

    function wcOpenSetPayPasswordModal() {
        let overlay = document.getElementById('wcSetPayPasswordModalOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'wcSetPayPasswordModalOverlay';
            overlay.className = 'wc-ap-overlay';
            overlay.innerHTML = `
                <div class="wc-ap-sheet" onclick="event.stopPropagation()">
                    <div class="wc-ap-header">
                        <div class="wc-ap-close-btn" onclick="wcCloseSetPayPasswordModal()">
                            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                        <div class="wc-ap-logo">
                            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: #000;"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.88 2.78.99.08 2.02-.51 2.6-1.28z"/></svg>
                            Pay
                        </div>
                        <div style="width: 32px;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1; justify-content: center; padding: 10px 0 20px;">
                        <div class="wc-pwd-title" id="wcSetPayModalTitle" style="font-size: 18px; font-weight: 600; margin-bottom: 24px;">请设置 6 位支付密码</div>
                        <div class="wc-pwd-dots" id="wcSetPayModalDots" style="margin-bottom: 30px;">
                            <div class="wc-pwd-dot"></div>
                            <div class="wc-pwd-dot"></div>
                            <div class="wc-pwd-dot"></div>
                            <div class="wc-pwd-dot"></div>
                            <div class="wc-pwd-dot"></div>
                            <div class="wc-pwd-dot"></div>
                        </div>
                        <div class="wc-keypad">
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('1')">1</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('2')">2</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('3')">3</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('4')">4</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('5')">5</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('6')">6</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('7')">7</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('8')">8</button>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('9')">9</button>
                            <div class="wc-key-btn empty"></div>
                            <button type="button" class="wc-key-btn" onclick="wcInputSetPayPwd('0')">0</button>
                            <button type="button" class="wc-key-btn" onclick="wcDeleteSetPayPwd()" style="display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; stroke: #000; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round;"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('wechatAppUI').appendChild(overlay);
        }

        wcSetPayPwdStage = 1;
        wcFirstEnteredPayPwd = '';
        wcCurrentEnteredPayPwd = '';
        wcUpdateSetPayModalUI();

        overlay.classList.add('show');
    }
    window.wcOpenSetPayPasswordModal = wcOpenSetPayPasswordModal;

    function wcCloseSetPayPasswordModal() {
        const overlay = document.getElementById('wcSetPayPasswordModalOverlay');
        if (overlay) overlay.classList.remove('show');
        wcSetPayPwdStage = 1;
        wcFirstEnteredPayPwd = '';
        wcCurrentEnteredPayPwd = '';
    }
    window.wcCloseSetPayPasswordModal = wcCloseSetPayPasswordModal;

    function wcUpdateSetPayModalUI() {
        const titleEl = document.getElementById('wcSetPayModalTitle');
        const dots = document.querySelectorAll('#wcSetPayModalDots .wc-pwd-dot');

        if (titleEl) {
            titleEl.textContent = wcSetPayPwdStage === 1 ? '请设置 6 位支付密码' : '请再次输入以确认';
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < wcCurrentEnteredPayPwd.length);
        });
    }

    async function wcInputSetPayPwd(num) {
        if (wcCurrentEnteredPayPwd.length >= 6) return;
        wcCurrentEnteredPayPwd += String(num);
        wcUpdateSetPayModalUI();

        if (wcCurrentEnteredPayPwd.length === 6) {
            if (wcSetPayPwdStage === 1) {
                // 第一次输入完成，延迟 180ms 自动平滑进入第二阶段
                wcFirstEnteredPayPwd = wcCurrentEnteredPayPwd;
                wcCurrentEnteredPayPwd = '';
                wcSetPayPwdStage = 2;
                setTimeout(() => {
                    wcUpdateSetPayModalUI();
                }, 180);
            } else if (wcSetPayPwdStage === 2) {
                // 第二次输入完成，校验两次是否一致
                if (wcCurrentEnteredPayPwd === wcFirstEnteredPayPwd) {
                    try {
                        wcWalletData.payPassword = wcCurrentEnteredPayPwd;
                        wcWalletData.isPayPasswordSet = true;
                        await wcSaveWalletData();
                        showToast('支付密码设置成功');
                        wcCloseSetPayPasswordModal();
                        wcOpenWalletSettings(); // 实时刷新设置列表状态为“已设置”
                    } catch (e) {
                        console.error('设置支付密码失败', e);
                        showToast('设置失败，请重试');
                        wcCloseSetPayPasswordModal();
                    }
                } else {
                    // 密码不一致，震动提示并重置回第一阶段
                    const dotsContainer = document.getElementById('wcSetPayModalDots');
                    if (dotsContainer) {
                        dotsContainer.style.animation = 'wcShake 0.4s ease';
                        setTimeout(() => { dotsContainer.style.animation = ''; }, 400);
                    }
                    showToast('两次输入的密码不一致，请重新设置');
                    wcSetPayPwdStage = 1;
                    wcFirstEnteredPayPwd = '';
                    wcCurrentEnteredPayPwd = '';
                    setTimeout(() => {
                        wcUpdateSetPayModalUI();
                    }, 400);
                }
            }
        }
    }
    window.wcInputSetPayPwd = wcInputSetPayPwd;

    function wcDeleteSetPayPwd() {
        if (wcCurrentEnteredPayPwd.length > 0) {
            wcCurrentEnteredPayPwd = wcCurrentEnteredPayPwd.slice(0, -1);
            wcUpdateSetPayModalUI();
        }
    }
    window.wcDeleteSetPayPwd = wcDeleteSetPayPwd;

    // 设置支付密码入口（检查是否已设置，已设置则禁止再次设置，只能去修改）
    function wcSetPaymentPassword() {
        if (wcWalletData.isPayPasswordSet) {
            if (typeof showToast === 'function') {
                showToast('已设置支付密码，如需修改请点击修改支付密码');
            }
            return;
        }
        wcOpenSetPayPasswordModal();
    }
    window.wcSetPaymentPassword = wcSetPaymentPassword;

    // 修改支付密码 (使用全屏页面)
    function wcChangePaymentPassword() {
        wcOpenWechatChangePayPwdPage();
    }
    window.wcChangePaymentPassword = wcChangePaymentPassword;

    // 充值逻辑
    function wcHandleRecharge() {
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('充值', { placeholder: '请输入充值金额' }, '确定').then(val => {
                if (val && !isNaN(val) && Number(val) > 0) {
                    const amount = Number(val);
                    wcWalletData.balance += amount;
                    wcWalletData.transactions.unshift({
                        id: Date.now(),
                        type: 'income',
                        title: '充值',
                        amount: amount,
                        createdAt: Date.now(),
                        icon: 'money'
                    });
                    wcSaveWalletData();
                    wcRenderWallet();
                    if (typeof showToast === 'function') showToast('充值成功');
                } else if (val !== null) {
                    if (typeof showToast === 'function') showToast('请输入有效金额');
                }
            });
        }
    }
    window.wcHandleRecharge = wcHandleRecharge;

    // 提现逻辑
    function wcHandleWithdraw() {
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('提现', { placeholder: '请输入提现金额' }, '确定').then(val => {
                if (val && !isNaN(val) && Number(val) > 0) {
                    const amount = Number(val);
                    if (amount > wcWalletData.balance) {
                        if (typeof showToast === 'function') showToast('余额不足');
                        return;
                    }
                    wcWalletData.balance -= amount;
                    wcWalletData.transactions.unshift({
                        id: Date.now(),
                        type: 'expense',
                        title: '提现',
                        amount: amount,
                        createdAt: Date.now(),
                        icon: 'money'
                    });
                    wcSaveWalletData();
                    wcRenderWallet();
                    if (typeof showToast === 'function') showToast('提现成功');
                } else if (val !== null) {
                    if (typeof showToast === 'function') showToast('请输入有效金额');
                }
            });
        }
    }
    window.wcHandleWithdraw = wcHandleWithdraw;

    // 营业厅逻辑
    function wcOpenBusinessHall() {
        if (window.BusinessApp && typeof window.BusinessApp.open === 'function') {
            window.BusinessApp.open();
        } else if (typeof showCustomAlert === 'function') {
            showCustomAlert('自助营业厅', '欢迎来到自助营业厅！\n\n当前设备网络连接正常，系统运行状态良好。如有更多业务需求，请联系系统管理员。');
        } else if (typeof showToast === 'function') {
            showToast('营业厅服务已连接');
        }
    }
    window.wcOpenBusinessHall = wcOpenBusinessHall;

    // 清空记录逻辑
    function wcClearTransactions() {
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('清空记录', '确定要清空所有交易记录吗？', '清空', true).then(confirmed => {
                if (confirmed) {
                    wcWalletData.transactions = [];
                    wcSaveWalletData();
                    wcRenderWallet();
                    if (typeof wcRenderAllTransactionsPage === 'function') wcRenderAllTransactionsPage();
                    if (typeof showToast === 'function') showToast('记录已清空');
                }
            });
        } else {
            wcWalletData.transactions = [];
            wcSaveWalletData();
            wcRenderWallet();
            if (typeof wcRenderAllTransactionsPage === 'function') wcRenderAllTransactionsPage();
        }
    }
    window.wcClearTransactions = wcClearTransactions;

    // ==========================================
    // 转账与 Apple Pay 逻辑
    // ==========================================

    let wcTransferAmount = 0;
    let wcApCurrentPwdLength = 0;
    let wcApActiveCards = [];
    let wcApActiveCardIndex = 0;
    let wcApCardElements = [];
    let wcApExternalBusy = false;

    // 打开转账页面
    async function wcOpenTransferPage() {
        wcCloseFunctionPanel();

        // 确保钱包数据已加载
        await wcLoadWalletData();

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (!contact) return;

        // 填充转账页面信息
        const avatarEl = document.getElementById('wcTransferAvatar');
        const nameEl = document.getElementById('wcTransferName');
        const accountEl = document.getElementById('wcTransferAccount');

        if (nameEl) nameEl.innerText = contact.name;
        if (accountEl) accountEl.innerText = contact.account || contact.phone || 'WeChat ID';

        if (avatarEl) {
            if (contact.avatar) {
                avatarEl.style.backgroundImage = `url('${contact.avatar}')`;
                avatarEl.innerHTML = '';
            } else {
                avatarEl.style.backgroundImage = 'none';
                avatarEl.innerHTML = getWcDefaultAvatarSvg();
            }
        }

        // 重置输入框
        const inputEl = document.getElementById('wcTransferAmountInput');
        const noteEl = document.getElementById('wcTransferNoteInput');
        const nextBtn = document.getElementById('wcTransferNextBtn');
        if (inputEl) {
            inputEl.value = '';
            wcUpdateTransferInputWidth();
        }
        if (noteEl) noteEl.value = '';
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.classList.remove('active');
        }

        // 切换页面
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-wc-transfer').classList.add('active');

        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'none';
    }
    window.wcOpenTransferPage = wcOpenTransferPage;

    function wcCloseTransferPage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-chat-room').classList.add('active');
    }
    window.wcCloseTransferPage = wcCloseTransferPage;

    // 动态计算输入框宽度
    function wcUpdateTransferInputWidth() {
        const input = document.getElementById('wcTransferAmountInput');
        if (!input) return;
        const span = document.createElement('span');
        span.style.fontSize = '72px';
        span.style.fontWeight = '200';
        // 必须与输入框保持一致的字体，否则计算宽度会偏小导致被砍掉一半
        span.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre';
        span.innerText = input.value || input.placeholder;
        document.body.appendChild(span);
        // 基础宽度调大到 180，并加上 20px 的安全边距
        input.style.width = Math.max(180, span.offsetWidth + 20) + 'px';
        document.body.removeChild(span);
    }

    // 监听金额输入
    document.getElementById('wcTransferAmountInput')?.addEventListener('input', function() {
        let val = this.value.replace(/[^\d.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
        if (parts.length === 2 && parts[1].length > 2) val = parts[0] + '.' + parts[1].substring(0, 2);

        this.value = val;
        wcUpdateTransferInputWidth();

        const nextBtn = document.getElementById('wcTransferNextBtn');
        if (parseFloat(val) > 0) {
            nextBtn.disabled = false;
            nextBtn.classList.add('active');
        } else {
            nextBtn.disabled = true;
            nextBtn.classList.remove('active');
        }
    });

    // 初始化卡片 DOM (同步钱包装扮 UI 风格，1:1 等比例缩小还原)
    function wcInitApCards() {
        const container = document.getElementById('wcApCardsContainer');
        if (!container) return;
        container.innerHTML = '';
        wcApCardElements = [];
        wcApActiveCardIndex = 0;

        // 同步主题 class 到支付弹窗
        const apOverlay = document.getElementById('wcApOverlay');
        if (apOverlay) {
            apOverlay.classList.remove('theme-luxury', 'theme-cute', 'theme-korean');
            if (['luxury', 'cute', 'korean'].includes(wcWalletData.cardTheme)) {
                apOverlay.classList.add(`theme-${wcWalletData.cardTheme}`);
            }
        }

        // 基础银行卡
        wcApActiveCards = [{ id: 'cash', name: 'Debit Card', number: '3022', type: 'VISA', bg: '', logoColor: '#fff', balance: wcWalletData.balance }];

        // Cash-only packet payments must use the same atomic wallet balance as the group ledger.
        if (!wcCurrentApContext?.cashOnly && wcWalletData.familyCards && wcWalletData.familyCards.length > 0) {
            wcWalletData.familyCards.forEach(fc => {
                if (fc.role !== 'sender') {
                    wcApActiveCards.push({
                        ...fc,
                        balance: fc.amount || 3000
                    });
                }
            });
        }

        const patternSvg = wcGetCardDecorPatternSvg(wcWalletData.cardTheme);

        wcApActiveCards.forEach((card, index) => {
            const el = document.createElement('div');
            const isCash = card.id === 'cash';
            el.className = `wc-ap-card wc-apple-card ${isCash ? 'wc-cash-card' : 'wc-family-card'} card-hidden`;
            if (card.bg && !isCash) {
                el.style.background = card.bg;
            }

            if (isCash) {
                // 1:1 还原钱包页面的银行卡排版
                el.innerHTML = `
                    ${patternSvg}
                    <div class="wc-card-content-layer">
                        <div class="wc-card-logo">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.223 14.38c-.358.548-1.025.702-1.573.344-1.636-1.07-3.696-1.31-6.12-.717-.62.15-1.25-.23-1.4-.85-.15-.62.23-1.25.85-1.4 2.78-.68 5.15-.39 7.04.84.548.358.702 1.025.344 1.573zm1.14-2.56c-.45.73-1.42.94-2.15.49-1.96-1.2-4.98-1.54-7.18-.84-.82.25-1.68-.2-1.93-1.02-.25-.82.2-1.68 1.02-1.93 2.6-0.82 6.06-0.43 8.38 1.01.73.45.94 1.42.49 2.15zm.1-2.67c-2.38-1.42-6.3-1.55-8.58-.86-.98.29-2.03-.26-2.32-1.24-.29-.98.26-2.03 1.24-2.32 2.7-0.81 7.18-0.65 9.98 1.02.89.53 1.18 1.68.65 2.57-.53.89-1.68 1.18-2.57.65z"/></svg>
                            Platinum Debit
                        </div>
                        <div style="display: flex; align-items: center; justify-content: flex-start; padding: 4px 0;">
                            <div class="wc-chip-visual"></div>
                        </div>
                        <div class="wc-card-bottom">
                            <div class="wc-card-number">•••• •••• •••• 3022</div>
                            <div class="wc-card-network">VISA</div>
                        </div>
                    </div>
                `;
            } else {
                // 1:1 还原钱包页面的亲属卡排版
                const isSender = card.role === 'sender';
                const labelText = isSender ? '本月赠送额度' : '本月可用额度';
                const displayName = card.name.includes('赠予') || card.name.includes('来自')
                    ? card.name
                    : (isSender ? '赠予: ' : '来自: ') + card.name.replace('亲属卡 (', '').replace(')', '');
                const amountVal = card.amount ? card.amount : (card.balance ? card.balance : 3000);
                const amountStr = Number(amountVal).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                el.innerHTML = `
                    ${patternSvg}
                    <div class="wc-card-content-layer">
                        <div class="wc-card-logo">
                            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            亲属卡
                        </div>
                        <div class="wc-card-balance-area">
                            <div class="wc-card-balance-label">${labelText}</div>
                            <div class="wc-card-balance-amount">¥ ${amountStr}</div>
                        </div>
                        <div class="wc-card-bottom">
                            <div class="wc-card-number">${displayName}</div>
                            <div class="wc-card-network">${card.type || 'AMEX'}</div>
                        </div>
                    </div>
                `;
            }

            el.onclick = () => {
                if (wcApActiveCardIndex === index) {
                    wcCycleApCards();
                } else {
                    wcApActiveCardIndex = index;
                    wcRenderApCards();
                }
            };

            container.appendChild(el);
            wcApCardElements.push(el);
        });

        wcRenderApCards();
    }

    // 渲染卡片位置 (保留卡片类型与装扮 class)
    function wcRenderApCards() {
        const n = wcApActiveCards.length;
        wcApCardElements.forEach((el, index) => {
            const isCash = wcApActiveCards[index].id === 'cash';
            el.className = `wc-ap-card wc-apple-card ${isCash ? 'wc-cash-card' : 'wc-family-card'}`;
            if (n === 1) {
                el.classList.add('card-center');
            } else if (n === 2) {
                if (index === wcApActiveCardIndex) el.classList.add('card-center');
                else el.classList.add('card-right');
            } else {
                if (index === wcApActiveCardIndex) {
                    el.classList.add('card-center');
                } else if (index === (wcApActiveCardIndex - 1 + n) % n) {
                    el.classList.add('card-left');
                } else if (index === (wcApActiveCardIndex + 1) % n) {
                    el.classList.add('card-right');
                } else {
                    el.classList.add('card-hidden');
                }
            }
        });

        const currentCard = wcApActiveCards[wcApActiveCardIndex];
        const cardTextEl = document.getElementById('wcApSelectedCardText');
        if (cardTextEl) cardTextEl.innerText = `${currentCard.name} (...${currentCard.number})`;
    }

    // 轮换下一张卡
    function wcCycleApCards() {
        if (wcApActiveCards.length <= 1) {
            const centerCard = document.querySelector('#wechatAppUI .card-center');
            if (centerCard) {
                centerCard.style.transform = 'translateX(0) scale(0.95)';
                setTimeout(() => centerCard.style.transform = 'translateX(0) scale(1)', 150);
            }
            return;
        }
        wcApActiveCardIndex = (wcApActiveCardIndex + 1) % wcApActiveCards.length;
        wcRenderApCards();
    }
    window.wcCycleApCards = wcCycleApCards;

    // 当前全局 Apple Pay 上下文配置
    let wcCurrentApContext = null;

    // 打开 Apple Pay 弹窗 (通用支持转账与话费充值)
    async function wcOpenApplePay(customOptions = null) {
        wcCurrentApContext = customOptions;
        wcApExternalBusy = false;

        // 确保无论在哪个应用拉起支付，都先从数据库载入最新余额、亲属卡和免密配置
        if (typeof wcLoadWalletData === 'function') {
            try {
                await wcLoadWalletData();
            } catch (e) {
                console.warn('加载钱包数据失败', e);
            }
        }

        if (customOptions && customOptions.amount) {
            wcTransferAmount = parseFloat(customOptions.amount);
            document.getElementById('wcApPayeeName').innerText = customOptions.payee || 'Pay 商家';
            document.getElementById('wcApAmountDisplay').innerText = '¥' + wcTransferAmount.toFixed(2);
        } else {
            const val = document.getElementById('wcTransferAmountInput')?.value || '0';
            wcTransferAmount = parseFloat(val);
            const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
            document.getElementById('wcApPayeeName').innerText = `Pay ${contact ? contact.name : '对方'}`;
            document.getElementById('wcApAmountDisplay').innerText = '¥' + wcTransferAmount.toFixed(2);
        }

        wcInitApCards();

        const apOverlay = document.getElementById('wcApOverlay');
        if (apOverlay && apOverlay.parentElement && apOverlay.parentElement.id === 'wechatAppUI') {
            const topScreen = document.querySelector('.screen') || document.querySelector('.iphone') || document.body;
            topScreen.appendChild(apOverlay);
        }

        document.getElementById('wc-ap-main-view').style.display = 'flex';
        document.getElementById('wc-ap-password-view').style.display = 'none';
        document.getElementById('wc-ap-success-view').style.display = 'none';
        document.getElementById('wcSuccessIcon').classList.remove('animate');

        wcApCurrentPwdLength = 0;
        document.querySelectorAll('.wc-pwd-dot').forEach(dot => dot.classList.remove('filled'));

        document.getElementById('wcApOverlay').classList.add('show');
    }
    window.wcOpenApplePay = wcOpenApplePay;

    function wcCloseApplePay() {
        if (wcApExternalBusy) return;
        const context = wcCurrentApContext;
        document.getElementById('wcApOverlay').classList.remove('show');
        wcCurrentApContext = null;
        if (context?.externalTransaction && !context.completed) {
            try { context.onCancel?.(); } catch (error) { console.warn('Group payment cancellation failed:', error); }
        }
    }
    window.wcCloseApplePay = wcCloseApplePay;

    // 点击底部确认按钮
    function wcHandleApConfirmClick() {
        const currentCard = wcApActiveCards[wcApActiveCardIndex];
        if (wcTransferAmount > currentCard.balance) {
            if (typeof showToast === 'function') showToast(`${currentCard.name}余额不足`);
            return;
        }

        // 读取真实的免密支付状态
        const isNoPwd = wcWalletData.isNoPwd;

        if (isNoPwd) {
            wcShowApSuccess();
        } else {
            document.getElementById('wc-ap-main-view').style.display = 'none';
            document.getElementById('wc-ap-password-view').style.display = 'flex';
        }
    }
    window.wcHandleApConfirmClick = wcHandleApConfirmClick;

    // 内部写好的 iOS 风格密码键盘输入逻辑
    function wcInputApPwd() {
        const dots = document.querySelectorAll('.wc-pwd-dot');
        if (wcApCurrentPwdLength < 6) {
            dots[wcApCurrentPwdLength].classList.add('filled');
            wcApCurrentPwdLength++;

            if (wcApCurrentPwdLength === 6) {
                const currentContext = wcCurrentApContext;
                setTimeout(() => {
                    if (currentContext === wcCurrentApContext &&
                        document.getElementById('wcApOverlay')?.classList.contains('show')) wcShowApSuccess();
                }, 200);
            }
        }
    }
    window.wcInputApPwd = wcInputApPwd;

    // 显示成功动画并执行扣款与回调逻辑
    function wcShowApSuccess() {
        const external = wcCurrentApContext?.externalTransaction ? wcCurrentApContext : null;
        if (external) {
            if (wcApExternalBusy) return;
            wcApExternalBusy = true;
            Promise.resolve().then(() => {
                if (typeof external.onSuccess !== 'function') throw new Error('红包支付回调无效');
                return external.onSuccess(wcTransferAmount);
            }).then(() => {
                external.completed = true;
                document.getElementById('wc-ap-main-view').style.display = 'none';
                document.getElementById('wc-ap-password-view').style.display = 'none';
                document.getElementById('wc-ap-success-view').style.display = 'flex';
                document.getElementById('wcSuccessIcon').classList.add('animate');
                setTimeout(() => {
                    wcApExternalBusy = false;
                    if (wcCurrentApContext === external) wcCloseApplePay();
                }, 1050);
            }).catch(error => {
                wcApExternalBusy = false;
                console.warn('Group red packet payment failed:', error);
                if (wcCurrentApContext === external) wcCloseApplePay();
                if (typeof showToast === 'function') showToast(error?.message || '红包付款未完成');
            });
            return;
        }
        document.getElementById('wc-ap-main-view').style.display = 'none';
        document.getElementById('wc-ap-password-view').style.display = 'none';
        document.getElementById('wc-ap-success-view').style.display = 'flex';

        document.getElementById('wcSuccessIcon').classList.add('animate');

        setTimeout(() => {
            const currentCard = wcApActiveCards[wcApActiveCardIndex];

            // 1. 扣除余额
            if (currentCard.id === 'cash') {
                wcWalletData.balance = Number((wcWalletData.balance - wcTransferAmount).toFixed(2));
            } else {
                const fc = wcWalletData.familyCards.find(c => c.id === currentCard.id);
                if (fc) {
                    fc.amount = Number((fc.amount - wcTransferAmount).toFixed(2));
                }
            }

            // 2. 区分是营业厅充值还是聊天室转账
            if (wcCurrentApContext && typeof wcCurrentApContext.onSuccess === 'function') {
                // 写入钱包账单明细
                wcWalletData.transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    title: wcCurrentApContext.title || '话费充值',
                    amount: wcTransferAmount,
                    createdAt: Date.now(),
                    icon: 'money'
                });
                wcSaveWalletData();
                if (typeof wcRenderWallet === 'function') wcRenderWallet();

                // 执行营业厅回调
                wcCurrentApContext.onSuccess(wcTransferAmount);
                wcCloseApplePay();
            } else {
                // 聊天室转账逻辑
                const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
                wcWalletData.transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    title: `转账给 ${contact ? contact.name : '对方'}`,
                    amount: wcTransferAmount,
                    createdAt: Date.now(),
                    icon: 'money'
                });
                wcSaveWalletData();
                if (typeof wcRenderWallet === 'function') wcRenderWallet();

                const note = document.getElementById('wcTransferNoteInput')?.value.trim() || '';
                let finalNote = note;
                if (currentCard.id !== 'cash') {
                    finalNote = finalNote ? `${finalNote} | 系统提示：User使用了你赠送的亲属卡付款` : `系统提示：User使用了你赠送的亲属卡付款`;
                }

                const msgText = finalNote ? `[转账] ¥${wcTransferAmount.toFixed(2)} (${finalNote})` : `[转账] ¥${wcTransferAmount.toFixed(2)}`;
                wcAppendChatMessage(msgText, 'sent', wcCurrentChatContactId, null, null, false);

                wcCloseApplePay();
                wcCloseTransferPage();

                if (typeof showToast === 'function') showToast('转账成功');
            }
        }, 1500);
    }

    // 处理点击转账卡片弹窗
    window.wcHandleTransferClick = function(msgId, isSent) {
        const messages = wcChatMessagesByContact[wcCurrentChatContactId];
        const msg = messages.find(m => m.id === msgId);
        if (!msg || (!msg.text.startsWith('[转账]') && !msg.text.startsWith('[已收款]') && !msg.text.startsWith('[已退还]') && !msg.text.startsWith('[已过期]'))) return;

        // 解析状态
        let transferState = 'pending';
        if (msg.text.startsWith('[已收款]')) transferState = 'received';
        else if (msg.text.startsWith('[已退还]')) transferState = 'rejected';
        else if (msg.text.startsWith('[已过期]')) transferState = 'expired';

        // 解析金额和备注
        const amountMatch = msg.text.match(/¥([\d.]+)/);
        const amount = amountMatch ? amountMatch[1] : '0.00';
        const noteMatch = msg.text.match(/\((.*?)\)/);
        const note = noteMatch ? noteMatch[1] : '';

        // 格式化时间
        const timeStr = wcFormatTransferTime(msg.createdAt);
        const settledTimeStr = wcFormatTransferTime(msg.transferSettledAt, '历史记录未保存准确时间');

        // 动态创建专属弹窗
        let overlay = document.getElementById('wcTransferDetailOverlay');
        if (!overlay) {
            const overlayHtml = `<div class="wc-transfer-detail-overlay" id="wcTransferDetailOverlay" onclick="if(event.target === this) this.classList.remove('show')"></div>`;
            document.getElementById('wechatAppUI').insertAdjacentHTML('beforeend', overlayHtml);
            overlay = document.getElementById('wcTransferDetailOverlay');
        }

        let iconHtml = '';
        let iconBg = '';
        let statusText = '';
        let showActions = false;
        let timeLabel = '转账时间';

        if (transferState === 'pending') {
            iconHtml = '<svg viewBox="0 0 24 24" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
            iconBg = '#FF9500';
            statusText = isSent ? '等待对方收款' : '待收款';
            showActions = !isSent; // 只有对方发给我的待收款，才显示收款/退还按钮
        } else if (transferState === 'received') {
            iconHtml = '<svg viewBox="0 0 24 24" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            iconBg = '#07C160';
            statusText = isSent ? '对方已收款' : '你已收款，资金已存入零钱';
            timeLabel = '收款时间';
        } else if (transferState === 'rejected') {
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill="none" fill-rule="nonzero"><path d="M16 0v16H0V0zM8.395999999999999 15.505333333333333l-0.008 0.0013333333333333333 -0.047333333333333324 0.023333333333333334 -0.013333333333333332 0.0026666666666666666 -0.009333333333333332 -0.0026666666666666666 -0.047333333333333324 -0.023999999999999997c-0.006666666666666666 -0.002 -0.012666666666666666 0 -0.016 0.004l-0.0026666666666666666 0.006666666666666666 -0.011333333333333334 0.2853333333333333 0.003333333333333333 0.013333333333333332 0.006666666666666666 0.008666666666666666 0.06933333333333333 0.049333333333333326 0.009999999999999998 0.0026666666666666666 0.008 -0.0026666666666666666 0.06933333333333333 -0.049333333333333326 0.008 -0.010666666666666666 0.0026666666666666666 -0.011333333333333334 -0.011333333333333334 -0.2846666666666666c-0.0013333333333333333 -0.006666666666666666 -0.005999999999999999 -0.011333333333333334 -0.010666666666666666 -0.011999999999999999m0.176 -0.07533333333333334 -0.009333333333333332 0.0013333333333333333 -0.12266666666666666 0.062 -0.006666666666666666 0.006666666666666666 -0.002 0.007333333333333332 0.011999999999999999 0.2866666666666666 0.003333333333333333 0.008 0.005333333333333333 0.005333333333333333 0.134 0.06133333333333333c0.008 0.0026666666666666666 0.015333333333333332 0 0.019333333333333334 -0.005333333333333333l0.0026666666666666666 -0.009333333333333332 -0.02266666666666667 -0.4093333333333333c-0.002 -0.008 -0.006666666666666666 -0.013333333333333332 -0.013333333333333332 -0.014666666666666665m-0.4766666666666666 0.0013333333333333333a0.015333333333333332 0.015333333333333332 0 0 0 -0.018 0.004l-0.004 0.009333333333333332 -0.02266666666666667 0.4093333333333333c0 0.008 0.004666666666666666 0.013333333333333332 0.011333333333333334 0.016l0.009999999999999998 -0.0013333333333333333 0.134 -0.062 0.006666666666666666 -0.005333333333333333 0.002 -0.007333333333333332 0.011999999999999999 -0.2866666666666666 -0.002 -0.008 -0.006666666666666666 -0.006666666666666666z" stroke-width="0.6667"></path><path fill="#ffffff" d="M14.44 6.274666666666667c0.952 3.5559999999999996 -1.158 7.212 -4.714666666666666 8.164666666666665 -3.0653333333333332 0.8213333333333332 -6.2026666666666666 -0.6333333333333333 -7.622 -3.3266666666666667a0.6666666666666666 0.6666666666666666 0 0 1 1.18 -0.6213333333333333 5.333333333333333 5.333333333333333 0 1 0 -0.30133333333333334 -4.299333333333333l0.7046666666666666 -0.15666666666666665c0.7906666666666666 -0.17666666666666667 1.2413333333333334 0.8706666666666667 0.5693333333333332 1.3233333333333333L2.4739999999999998 8.559999999999999c-0.47866666666666663 0.32199999999999995 -1.1466666666666665 -0.010666666666666666 -1.142 -0.612a6.668666666666667 6.668666666666667 0 0 1 4.942666666666666 -6.386666666666667C9.830666666666666 0.6066666666666667 13.486666666666666 2.717333333333333 14.439333333333332 6.273333333333333M10.399999999999999 4.8a0.6666666666666666 0.6666666666666666 0 0 1 0.13333333333333333 0.9333333333333332L9.333333333333332 7.333333333333333h0.6666666666666666a0.6666666666666666 0.6666666666666666 0 0 1 0 1.3333333333333333h-1.3333333333333333v0.6666666666666666h1.3333333333333333a0.6666666666666666 0.6666666666666666 0 0 1 0 1.3333333333333333h-1.3333333333333333v0.6666666666666666a0.6666666666666666 0.6666666666666666 0 0 1 -1.3333333333333333 0v-0.6666666666666666H6a0.6666666666666666 0.6666666666666666 0 0 1 0 -1.3333333333333333h1.3333333333333333v-0.6666666666666666H6a0.6666666666666666 0.6666666666666666 0 0 1 0 -1.3333333333333333h0.6666666666666666L5.466666666666666 5.7333333333333325a0.6666666666666666 0.6666666666666666 0 1 1 1.0666666666666667 -0.7999999999999999l1.4666666666666668 1.9553333333333331L9.466666666666665 4.933333333333334a0.6666666666666666 0.6666666666666666 0 0 1 0.9333333333333332 -0.13333333333333333" stroke-width="0.6667"></path></g></svg>';
            iconBg = '#FF3B30';
            statusText = isSent ? '对方已退还' : '已退还';
            timeLabel = '退还时间';
        } else if (transferState === 'expired') {
            iconHtml = '<svg viewBox="0 0 24 24" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
            iconBg = '#8E8E93';
            statusText = '已过期';
            timeLabel = '过期时间';
        }

        overlay.innerHTML = `
            <div class="wc-td-card" onclick="event.stopPropagation()">
                <div class="wc-td-header">
                    <div class="wc-td-close" onclick="document.getElementById('wcTransferDetailOverlay').classList.remove('show')">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div class="wc-td-content">
                    <div class="wc-td-icon" id="wc-td-icon-box" style="background-color: ${iconBg};">
                        ${iconHtml}
                    </div>
                    <div class="wc-td-status" id="wc-td-status-text">${statusText}</div>
                    <div class="wc-td-amount"><span>¥</span>${amount}</div>
                    ${note ? `<div class="wc-td-note">${note}</div>` : ''}

                    ${showActions ? `
                    <div class="wc-td-actions" id="wc-td-actions">
                        <button class="wc-td-btn primary" onclick="wcProcessTransfer('${msgId}', 'received')">确认收款</button>
                        <button class="wc-td-btn reject" onclick="wcProcessTransfer('${msgId}', 'rejected')">退还</button>
                    </div>
                    ` : ''}

                    <div class="wc-td-info-list">
                        <div class="wc-td-info-row">
                            <div class="wc-td-info-label">转账时间</div>
                            <div class="wc-td-info-value">${timeStr}</div>
                        </div>
                        ${transferState !== 'pending' ? `
                        <div class="wc-td-info-row" id="wc-td-receive-time-row">
                            <div class="wc-td-info-label" id="wc-td-receive-time-label">${timeLabel}</div>
                            <div class="wc-td-info-value" id="wc-td-receive-time-value">${settledTimeStr}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        overlay.classList.add('show');
    }

    // Prevent double settlement while the wallet and message are committing.
    let wcTransferSettlementPending = false;
    window.wcProcessTransfer = async function(msgId, action) {
        const contactId = wcCurrentChatContactId;
        const accountId = wcGetCurrentAccountId();
        const messages = wcChatMessagesByContact?.[contactId];
        const msg = Array.isArray(messages) ? messages.find(item => String(item.id) === String(msgId)) : null;
        if (wcTransferSettlementPending || !msg || typeof msg.text !== 'string'
            || !msg.text.startsWith('[转账]') || !['received', 'rejected'].includes(action)) return;
        if (action === 'received' && msg.type !== 'received') return;

        const shouldCredit = (action === 'received' && msg.type === 'received')
            || (action === 'rejected' && msg.type === 'sent');
        const amountMatch = msg.text.match(/¥([\d.]+)/);
        const amount = amountMatch ? Number(amountMatch[1]) : NaN;
        if (shouldCredit && (!Number.isFinite(amount) || amount <= 0)) {
            if (typeof showToast === 'function') showToast('转账金额无效');
            return;
        }

        const previousText = msg.text;
        const previousSettledAt = msg.transferSettledAt;
        const previousBalance = wcWalletData.balance;
        const previousTransactions = wcWalletData.transactions.slice();
        wcTransferSettlementPending = true;
        let succeeded = false;
        try {
            const settledAt = Date.now();
            msg.text = msg.text.replace('[转账]', action === 'received' ? '[已收款]' : '[已退还]');
            msg.transferSettledAt = settledAt;

            // One source message may create at most one credit or refund ledger entry.
            const alreadyCredited = wcWalletData.transactions.some(tx =>
                String(tx.transferMessageId || '') === String(msg.id)
                && String(tx.transferContactId || '') === String(contactId));
            if (shouldCredit && !alreadyCredited) {
                wcWalletData.balance = Number((Number(wcWalletData.balance) + amount).toFixed(2));
                wcWalletData.transactions.unshift({
                    id: settledAt,
                    type: 'income',
                    title: action === 'received' ? '收到转账' : '转账退款',
                    amount,
                    createdAt: settledAt,
                    icon: 'money',
                    transferMessageId: String(msg.id),
                    transferContactId: String(contactId)
                });
            }

            succeeded = typeof window.wcCommitChatContactWallet === 'function'
                && await window.wcCommitChatContactWallet(contactId, wcBuildWalletRecord(accountId));
            if (!succeeded) throw new Error('Transfer settlement not persisted');
        } catch (error) {
            msg.text = previousText;
            if (previousSettledAt === undefined) delete msg.transferSettledAt;
            else msg.transferSettledAt = previousSettledAt;
            wcWalletData.balance = previousBalance;
            wcWalletData.transactions = previousTransactions;
            console.error('Unable to settle transfer:', error);
            if (typeof showToast === 'function') showToast('交易保存失败，请重试');
        } finally {
            wcTransferSettlementPending = false;
        }
        if (wcCurrentChatContactId === contactId) {
            wcRenderChatMessages(contactId);
            if (succeeded) window.wcHandleTransferClick(msg.id, msg.type === 'sent');
        }
        if (typeof wcRenderWallet === 'function') wcRenderWallet();
    };

    window.wcHandleFamilyCardClick = function(msgId, isSent) {
        const messages = wcChatMessagesByContact[wcCurrentChatContactId];
        const msg = messages.find(m => m.id === msgId);
        if (!msg) return;

        let fcState = 'pending';
        if (msg.text.startsWith('[已领取亲属卡]')) fcState = 'received';
        else if (msg.text.startsWith('[已拒绝亲属卡]')) fcState = 'rejected';
        else if (msg.text.startsWith('[索要亲属卡]')) fcState = 'request';

        const amountMatch = msg.text.match(/¥([\d.]+)/);
        const amount = amountMatch ? amountMatch[1] : '3000.00';

        const noteMatch = msg.text.match(/\((.*?)\)/);
        const note = noteMatch ? noteMatch[1] : '';

        let overlay = document.getElementById('wcTransferDetailOverlay');
        if (!overlay) {
            const overlayHtml = `<div class="wc-transfer-detail-overlay" id="wcTransferDetailOverlay" onclick="if(event.target === this) this.classList.remove('show')"></div>`;
            document.getElementById('wechatAppUI').insertAdjacentHTML('beforeend', overlayHtml);
            overlay = document.getElementById('wcTransferDetailOverlay');
        }

        let iconHtml = '<svg viewBox="0 0 24 24" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>';
        let iconBg = '#FF9500';
        let statusText = '';
        let showActions = false;
        let actionType = '';

        if (fcState === 'pending') {
            statusText = isSent ? '等待对方领取' : '待领取';
            showActions = !isSent; // 只有对方发给我的，我才能领取/拒绝
            actionType = 'receive_fc';
        } else if (fcState === 'received') {
            iconBg = '#07C160';
            statusText = isSent ? '对方已领取' : '你已领取';
        } else if (fcState === 'rejected') {
            iconBg = '#FF3B30';
            iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill="none" fill-rule="nonzero"><path d="M16 0v16H0V0zM8.395999999999999 15.505333333333333l-0.008 0.0013333333333333333 -0.047333333333333324 0.023333333333333334 -0.013333333333333332 0.0026666666666666666 -0.009333333333333332 -0.0026666666666666666 -0.047333333333333324 -0.023999999999999997c-0.006666666666666666 -0.002 -0.012666666666666666 0 -0.016 0.004l-0.0026666666666666666 0.006666666666666666 -0.011333333333333334 0.2853333333333333 0.003333333333333333 0.013333333333333332 0.006666666666666666 0.008666666666666666 0.06933333333333333 0.049333333333333326 0.009999999999999998 0.0026666666666666666 0.008 -0.0026666666666666666 0.06933333333333333 -0.049333333333333326 0.008 -0.010666666666666666 0.0026666666666666666 -0.011333333333333334 -0.011333333333333334 -0.2846666666666666c-0.0013333333333333333 -0.006666666666666666 -0.005999999999999999 -0.011333333333333334 -0.010666666666666666 -0.011999999999999999m0.176 -0.07533333333333334 -0.009333333333333332 0.0013333333333333333 -0.12266666666666666 0.062 -0.006666666666666666 0.006666666666666666 -0.002 0.007333333333333332 0.011999999999999999 0.2866666666666666 0.003333333333333333 0.008 0.005333333333333333 0.005333333333333333 0.134 0.06133333333333333c0.008 0.0026666666666666666 0.015333333333333332 0 0.019333333333333334 -0.005333333333333333l0.0026666666666666666 -0.009333333333333332 -0.02266666666666667 -0.4093333333333333c-0.002 -0.008 -0.006666666666666666 -0.013333333333333332 -0.013333333333333332 -0.014666666666666665m-0.4766666666666666 0.0013333333333333333a0.015333333333333332 0.015333333333333332 0 0 0 -0.018 0.004l-0.004 0.009333333333333332 -0.02266666666666667 0.4093333333333333c0 0.008 0.004666666666666666 0.013333333333333332 0.011333333333333334 0.016l0.009999999999999998 -0.0013333333333333333 0.134 -0.062 0.006666666666666666 -0.005333333333333333 0.002 -0.007333333333333332 0.011999999999999999 -0.2866666666666666 -0.002 -0.008 -0.006666666666666666 -0.006666666666666666z" stroke-width="0.6667"></path><path fill="#ffffff" d="M14.44 6.274666666666667c0.952 3.5559999999999996 -1.158 7.212 -4.714666666666666 8.164666666666665 -3.0653333333333332 0.8213333333333332 -6.2026666666666666 -0.6333333333333333 -7.622 -3.3266666666666667a0.6666666666666666 0.6666666666666666 0 0 1 1.18 -0.6213333333333333 5.333333333333333 5.333333333333333 0 1 0 -0.30133333333333334 -4.299333333333333l0.7046666666666666 -0.15666666666666665c0.7906666666666666 -0.17666666666666667 1.2413333333333334 0.8706666666666667 0.5693333333333332 1.3233333333333333L2.4739999999999998 8.559999999999999c-0.47866666666666663 0.32199999999999995 -1.1466666666666665 -0.010666666666666666 -1.142 -0.612a6.668666666666667 6.668666666666667 0 0 1 4.942666666666666 -6.386666666666667C9.830666666666666 0.6066666666666667 13.486666666666666 2.717333333333333 14.439333333333332 6.273333333333333M10.399999999999999 4.8a0.6666666666666666 0.6666666666666666 0 0 1 0.13333333333333333 0.9333333333333332L9.333333333333332 7.333333333333333h0.6666666666666666a0.6666666666666666 0.6666666666666666 0 0 1 0 1.3333333333333333h-1.3333333333333333v0.6666666666666666h1.3333333333333333a0.6666666666666666 0.6666666666666666 0 0 1 0 1.3333333333333333h-1.3333333333333333v0.6666666666666666a0.6666666666666666 0.6666666666666666 0 0 1 -1.3333333333333333 0v-0.6666666666666666H6a0.6666666666666666 0.6666666666666666 0 0 1 0 -1.3333333333333333h1.3333333333333333v-0.6666666666666666H6a0.6666666666666666 0.6666666666666666 0 0 1 0 -1.3333333333333333h0.6666666666666666L5.466666666666666 5.7333333333333325a0.6666666666666666 0.6666666666666666 0 1 1 1.0666666666666667 -0.7999999999999999l1.4666666666666668 1.9553333333333331L9.466666666666665 4.933333333333334a0.6666666666666666 0.6666666666666666 0 0 1 0.9333333333333332 -0.13333333333333333" stroke-width="0.6667"></path></g></svg>`;
        } else if (fcState === 'request') {
            statusText = isSent ? '等待对方赠送' : '对方请求你赠送亲属卡';
            showActions = !isSent; // 只有对方索要，我才能赠送/拒绝
            actionType = 'send_fc';
        }

        overlay.innerHTML = `
            <div class="wc-td-card" onclick="event.stopPropagation()">
                <div class="wc-td-header">
                    <div class="wc-td-close" onclick="document.getElementById('wcTransferDetailOverlay').classList.remove('show')">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div class="wc-td-content">
                    <div class="wc-td-icon" id="wc-td-icon-box" style="background-color: ${iconBg};">
                        ${iconHtml}
                    </div>
                    <div class="wc-td-status" id="wc-td-status-text">${statusText}</div>
                    <div class="wc-td-amount">${fcState === 'request' ? '亲属卡' : `<span>¥</span>${amount}`}</div>
                    ${note ? `<div class="wc-td-note">${note}</div>` : ''}

                    ${showActions ? `
                    <div class="wc-td-actions" id="wc-td-actions">
                        <button class="wc-td-btn primary" onclick="wcProcessFamilyCard('${msgId}', '${actionType}')">${actionType === 'receive_fc' ? '领取' : '赠送'}</button>
                        <button class="wc-td-btn reject" onclick="wcProcessFamilyCard('${msgId}', 'reject_fc')">拒绝</button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        overlay.classList.add('show');
    }

    window.wcProcessFamilyCard = function(msgId, action) {
        const messages = wcChatMessagesByContact[wcCurrentChatContactId];
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            if (action === 'receive_fc') {
                msg.text = msg.text.replace('[赠送亲属卡]', '[已领取亲属卡]');
                const amountMatch = msg.text.match(/¥([\d.]+)/);
                const amount = amountMatch ? parseFloat(amountMatch[1]) : 3000.00;

                // 添加到钱包
                const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
                wcWalletData.familyCards.push({
                    id: 'fc_' + Date.now(),
                    role: 'receiver', // 标记为我收到的
                    name: `来自: ${contact ? contact.name : '对方'}`,
                    number: '1004',
                    type: 'AMERICAN EXPRESS',
                    bg: 'linear-gradient(135deg, #3D4D6B 0%, #101C37 40%, #7B8AA0 60%, #101C37 100%)',
                    logo: 'F',
                    logoColor: '#E4E8EB',
                    amount: amount
                });
                wcSaveWalletData();

                document.getElementById('wcTransferDetailOverlay').classList.remove('show');
                if (typeof showToast === 'function') showToast('已领取亲属卡');
            } else if (action === 'reject_fc') {
                if (msg.text.startsWith('[赠送亲属卡]')) {
                    msg.text = msg.text.replace('[赠送亲属卡]', '[已拒绝亲属卡]');
                } else if (msg.text.startsWith('[索要亲属卡]')) {
                    msg.text = msg.text.replace('[索要亲属卡]', '[已拒绝亲属卡]');
                }
                document.getElementById('wcTransferDetailOverlay').classList.remove('show');
                if (typeof showToast === 'function') showToast('已拒绝');
            } else if (action === 'send_fc') {
                document.getElementById('wcTransferDetailOverlay').classList.remove('show');

                const amountMatch = msg.text.match(/¥([\d.]+)/);
                const amount = amountMatch ? parseFloat(amountMatch[1]) : 3000.00;
                const noteMatch = msg.text.match(/\((.*?)\)/);
                const note = noteMatch ? noteMatch[1] : '';

                if (typeof showCustomConfirm === 'function') {
                    showCustomConfirm('确认赠送', `是否确认赠送亲属卡 额度：¥${amount.toFixed(2)}？`, '确认', false).then(confirmed => {
                        if (confirmed) {
                            const text = note ? `[赠送亲属卡] 额度：¥${amount.toFixed(2)} (${note})` : `[赠送亲属卡] 额度：¥${amount.toFixed(2)}`;
                            wcAppendChatMessage(text, 'sent', wcCurrentChatContactId, null, null, false);
                            if (typeof showToast === 'function') showToast('已发送亲属卡');
                        }
                    });
                }
            }
            wcSaveChatData();
            wcRenderChatMessages(wcCurrentChatContactId);
        }
    }

    window.wcProcessMusicInvite = function(msgId, action) {
        const messages = wcChatMessagesByContact[wcCurrentChatContactId];
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            if (action === 'accept') {
                msg.text = msg.text.replace('[音乐邀请]', '[已接受听歌]');
                if (typeof showToast === 'function') showToast('已接受听歌邀请');

                // Use the shared invitation flow without discarding the playing queue.
                const contentStr = msg.text.replace(/\[已接受听歌\]/, '').trim();
                const parts = contentStr.split('|');
                const songInfo = parts[0] ? parts[0].trim() : '';
                const coverUrl = parts[1] ? parts[1].trim() : '';
                const songId = parts[2] ? parts[2].trim() : '';

                if (songId && typeof applemusicAcceptListenTogether === 'function') {
                    const songName = songInfo.split('-')[0] ? songInfo.split('-')[0].trim() : '未知歌曲';
                    const artistName = songInfo.split('-')[1] ? songInfo.split('-')[1].trim() : '未知歌手';
                    applemusicAcceptListenTogether(songId, songName, artistName, coverUrl, wcCurrentChatContactId);
                }

                if (typeof openMusicApp === 'function') openMusicApp();

            } else if (action === 'reject') {
                msg.text = msg.text.replace('[音乐邀请]', '[已拒绝听歌]');
                if (typeof showToast === 'function') showToast('已拒绝邀请');
            }
            wcSaveChatData();
            wcRenderChatMessages(wcCurrentChatContactId);
        }
    }

    window.wcOpenReceiveMusicInviteModal = function(msgId, contactId) {
        const contact = wcContactsList.find(c => c.id === contactId);
        if (!contact) return;

        const messages = wcChatMessagesByContact[contactId];
        const msg = messages.find(m => m.id === msgId);
        if (!msg) return;

        // 解析歌曲信息
        const contentStr = msg.text.replace(/\[音乐邀请\]|\[已接受听歌\]|\[已拒绝听歌\]/, '').trim();
        const parts = contentStr.split('|');
        const songInfo = parts[0] ? parts[0].trim() : '未知歌曲';
        const songName = songInfo.split('-')[0] ? songInfo.split('-')[0].trim() : '未知歌曲';

        let overlay = document.getElementById('wcReceiveMusicInviteOverlay');
        if (!overlay) {
            // 修复：点击背景空白处也能关闭弹窗
            const overlayHtml = `<div class="wc-receive-music-invite-overlay" id="wcReceiveMusicInviteOverlay" onclick="if(event.target === this) wcCloseReceiveMusicInviteModal()"></div>`;
            document.getElementById('wechatAppUI').insertAdjacentHTML('beforeend', overlayHtml);
            overlay = document.getElementById('wcReceiveMusicInviteOverlay');
        }

        const charAvatar = contact.avatar || '';
        const userAvatar = typeof appSettings !== 'undefined' && appSettings.wc_current_user_avatar ? appSettings.wc_current_user_avatar : '';
        const charName = contact.remark || contact.name || '对方';

        const charAvatarHtml = charAvatar ? `<img src="${charAvatar}">` : getWcDefaultAvatarSvg();
        const userAvatarHtml = userAvatar ? `<img src="${userAvatar}">` : getWcDefaultAvatarSvg();

        overlay.innerHTML = `
            <div class="wc-rmi-modal">
                <div class="wc-rmi-avatars">
                    <div class="wc-rmi-avatar-box left">
                        ${charAvatarHtml}
                    </div>
                    <div class="wc-rmi-avatar-box right">
                        ${userAvatarHtml}
                    </div>
                </div>
                <div class="wc-rmi-title">${charName}</div>
                <div class="wc-rmi-subtitle">邀请你一起听 ${songName}</div>
                <div class="wc-rmi-actions">
                    <div class="wc-rmi-btn reject" onclick="wcProcessMusicInvite('${msgId}', 'reject'); wcCloseReceiveMusicInviteModal();">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="wc-rmi-btn accept" onclick="wcProcessMusicInvite('${msgId}', 'accept'); wcCloseReceiveMusicInviteModal();">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
            </div>
        `;

        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    }

    // 新增：专门用于彻底关闭弹窗并移除遮罩的函数
    window.wcCloseReceiveMusicInviteModal = function() {
        const overlay = document.getElementById('wcReceiveMusicInviteOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            // 等待 300ms 动画结束后，彻底隐藏 DOM，释放点击事件
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // 后台搜索真实音乐数据并更新聊天记录
    async function wcSearchAndUpdateMusicInvite(msgId, contactId, songInfo) {
        if (typeof applemusicGetApiBaseUrl !== 'function') return;

        try {
            const baseUrl = applemusicGetApiBaseUrl();
            const keyword = encodeURIComponent(songInfo);
            const response = await fetch(`${baseUrl}/cloudsearch?keywords=${keyword}&type=1`);
            const data = await response.json();

            if (data.code === 200 && data.result && data.result.songs && data.result.songs.length > 0) {
                const song = data.result.songs[0];
                const realSongId = song.id;
                const realCover = song.al.picUrl ? song.al.picUrl + '?param=500y500' : '';
                const realSongName = song.name;
                const realArtistName = song.ar.map(a => a.name).join(', ');

                // 更新聊天记录
                const messages = wcChatMessagesByContact[contactId];
                if (messages) {
                    const msg = messages.find(m => m.id === msgId);
                    if (msg && msg.text.startsWith('[音乐邀请]')) {
                        // 格式：[音乐邀请] 歌名 - 歌手 | 封面URL | 歌曲ID
                        msg.text = `[音乐邀请] ${realSongName} - ${realArtistName} | ${realCover} | ${realSongId}`;
                        wcSaveChatData();

                        // 如果当前正在该聊天室，重新渲染并弹出邀请窗口
                        if (wcCurrentChatContactId === contactId) {
                            wcRenderChatMessages(contactId);
                            setTimeout(() => {
                                if (typeof wcOpenReceiveMusicInviteModal === 'function') {
                                    wcOpenReceiveMusicInviteModal(msgId, contactId);
                                }
                            }, 300);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('搜索音乐失败:', error);
            // 搜索失败，直接弹出默认窗口
            if (wcCurrentChatContactId === contactId) {
                setTimeout(() => {
                    if (typeof wcOpenReceiveMusicInviteModal === 'function') {
                        wcOpenReceiveMusicInviteModal(msgId, contactId);
                    }
                }, 300);
            }
        }
    }

    let wcFcCurrentAction = 'send'; // 'send' or 'request'

    function wcOpenFamilyCardPrompt() {
        wcCloseFunctionPanel();
        const modal = document.getElementById('wcFamilyCardModalOverlay');
        if (modal) {
            // 重置输入框
            document.getElementById('wcFcAmountInput').value = '';
            document.getElementById('wcFcNoteInput').value = '';

            // 隐藏索要/赠送切换栏
            const segmentControl = modal.querySelector('.wc-fc-segment-control');
            if (segmentControl) segmentControl.style.display = 'none';

            wcFcCurrentAction = 'send'; // 强制设为赠送
            const confirmBtn = document.getElementById('wcFcConfirmBtn');
            if (confirmBtn) confirmBtn.innerText = '赠送';

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }
    window.wcOpenFamilyCardPrompt = wcOpenFamilyCardPrompt;

    function wcCloseFamilyCardModal(event) {
        if (event && event.target !== document.getElementById('wcFamilyCardModalOverlay')) return;
        const modal = document.getElementById('wcFamilyCardModalOverlay');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }
    window.wcCloseFamilyCardModal = wcCloseFamilyCardModal;

    function wcSwitchFcTab(index, text) {
        wcFcCurrentAction = index === 0 ? 'send' : 'request';

        // 移动滑块
        const slider = document.getElementById('wcFcSegmentSlider');
        if (slider) slider.style.transform = `translateX(${index * 100}%)`;

        // 切换按钮 active 状态
        const btns = document.querySelectorAll('#wechatAppUI .wc-fc-segment-btn');
        btns.forEach((btn, i) => {
            if (i === index) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // 更改底部确认按钮文字
        const confirmBtn = document.getElementById('wcFcConfirmBtn');
        if (confirmBtn) confirmBtn.innerText = text;
    }
    window.wcSwitchFcTab = wcSwitchFcTab;

    function wcConfirmFamilyCard() {
        const amountInput = document.getElementById('wcFcAmountInput').value;
        const noteInput = document.getElementById('wcFcNoteInput').value.trim();

        if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
            if (typeof showToast === 'function') showToast('请输入有效金额');
            return;
        }

        const amount = Number(amountInput);
        const text = noteInput ? `[赠送亲属卡] 额度：¥${amount.toFixed(2)} (${noteInput})` : `[赠送亲属卡] 额度：¥${amount.toFixed(2)}`;

        // 同步添加到我送出的亲属卡中
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (!wcWalletData.familyCards) wcWalletData.familyCards = [];
        wcWalletData.familyCards.push({
            id: 'fc_' + Date.now(),
            role: 'sender',
            name: `赠予: ${contact ? contact.name : '对方'}`,
            number: '1004',
            type: 'AMERICAN EXPRESS',
            bg: 'linear-gradient(135deg, #4A4A4C 0%, #242426 40%, #5E5E62 60%, #1C1C1E 100%)',
            logo: 'F',
            logoColor: '#E4E8EB',
            amount: amount
        });
        wcSaveWalletData();

        wcAppendChatMessage(text, 'sent', wcCurrentChatContactId, null, null, false);
        wcCloseFamilyCardModal();
    }
    window.wcConfirmFamilyCard = wcConfirmFamilyCard;

    // ==========================================
    // 钱包卡片装扮与竖向堆叠抽屉逻辑
    // ==========================================

    let wcIsStackExpanded = false;

    // 动态应用自定义 CSS 样式标签
    function wcApplyWalletCustomStyleTag(css) {
        let styleTag = document.getElementById('wcWalletCustomCardStyle');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wcWalletCustomCardStyle';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = css || '';
    }

    // 实时预览自定义 CSS
    function wcLiveApplyWalletCardCss(css) {
        wcWalletData.customCardCss = css;
        wcApplyWalletCustomStyleTag(css);
    }
    window.wcLiveApplyWalletCardCss = wcLiveApplyWalletCardCss;

    // 重置自定义 CSS
    function wcResetWalletCardCss() {
        const input = document.getElementById('wcWalletCustomCssInput');
        if (input) input.value = '';
        wcWalletData.customCardCss = '';
        wcApplyWalletCustomStyleTag('');
        wcSaveWalletData();
        wcRenderWallet();
    }
    window.wcResetWalletCardCss = wcResetWalletCardCss;

    // 暂存用户打开抽屉时的状态，以便点击取消时完全还原
    let wcInitialThemeState = {
        theme: 'luxury',
        css: ''
    };

    // 为不同卡片生成专属的高清 SVG 纹理背景 (绝不单纯换色)
    function wcGetCardDecorPatternSvg(themeId) {
        if (themeId === 'luxury') {
            // 高级感：同心圆光轨、放射状星芒线条、几何奢华图腾
            return `
                <svg class="wc-card-pattern" viewBox="0 0 340 215" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="280" cy="50" r="130" stroke="rgba(230, 213, 172, 0.12)" stroke-width="1.5" fill="none"/>
                    <circle cx="280" cy="50" r="95" stroke="rgba(230, 213, 172, 0.18)" stroke-width="1" fill="none" stroke-dasharray="4 4"/>
                    <circle cx="280" cy="50" r="60" stroke="rgba(230, 213, 172, 0.22)" stroke-width="1" fill="none"/>
                    <path d="M 280 10 L 280 90 M 240 50 L 320 50" stroke="rgba(230, 213, 172, 0.25)" stroke-width="1.2"/>
                    <path d="M 252 22 L 308 78 M 252 78 L 308 22" stroke="rgba(230, 213, 172, 0.15)" stroke-width="0.8"/>
                    <path d="M -20 180 Q 80 120 180 220" stroke="rgba(230, 213, 172, 0.1)" stroke-width="1.5" fill="none"/>
                </svg>
            `;
        } else if (themeId === 'cute') {
            // 可爱风：柔美波浪云彩、几何流星四角闪光星芒、可爱波点
            return `
                <svg class="wc-card-pattern" viewBox="0 0 340 215" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 140 C 60 120 120 160 180 135 C 240 110 290 145 340 120 L 340 215 L 0 215 Z" fill="rgba(255, 255, 255, 0.25)"/>
                    <path d="M 0 165 C 70 145 130 180 200 155 C 270 130 310 160 340 150 L 340 215 L 0 215 Z" fill="rgba(255, 255, 255, 0.35)"/>
                    <path d="M 260 40 Q 260 55 275 55 Q 260 55 260 70 Q 260 55 245 55 Q 260 55 260 40 Z" fill="rgba(255, 255, 255, 0.6)"/>
                    <path d="M 70 30 Q 70 40 80 40 Q 70 40 70 50 Q 70 40 60 40 Q 70 40 70 30 Z" fill="rgba(255, 255, 255, 0.5)"/>
                    <circle cx="150" cy="45" r="3" fill="rgba(255, 255, 255, 0.4)"/>
                    <circle cx="170" cy="35" r="2" fill="rgba(255, 255, 255, 0.4)"/>
                </svg>
            `;
        } else if (themeId === 'korean') {
            // 韩系风：极简留白微弧形曲线、现代条形码元素、交叉对角细线
            return `
                <svg class="wc-card-pattern" viewBox="0 0 340 215" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="20" x2="320" y2="20" stroke="rgba(0, 0, 0, 0.06)" stroke-width="1"/>
                    <line x1="20" y1="195" x2="320" y2="195" stroke="rgba(0, 0, 0, 0.06)" stroke-width="1"/>
                    <circle cx="300" cy="110" r="85" stroke="rgba(0, 0, 0, 0.05)" stroke-width="1.2" fill="none"/>
                    <circle cx="300" cy="110" r="50" stroke="rgba(0, 0, 0, 0.06)" stroke-width="0.8" fill="none" stroke-dasharray="3 3"/>
                    <path d="M 230 180 L 230 190 M 234 180 L 234 190 M 240 180 L 240 190 M 243 180 L 243 190 M 248 180 L 248 190 M 254 180 L 254 190" stroke="rgba(0, 0, 0, 0.2)" stroke-width="1.2"/>
                </svg>
            `;
        }
        return '';
    }

    // 打开卡片装扮抽屉
    function wcOpenWalletThemeDrawer() {
        const overlay = document.getElementById('wcWalletThemeDrawerOverlay');
        if (!overlay) return;

        // 记录打开前的状态，以供取消时还原
        wcInitialThemeState = {
            theme: wcWalletData.cardTheme || 'luxury',
            css: wcWalletData.customCardCss || ''
        };

        const cssInput = document.getElementById('wcWalletCustomCssInput');
        if (cssInput) cssInput.value = wcWalletData.customCardCss || '';

        wcIsStackExpanded = false;
        const toggleBtn = document.getElementById('wcWtdToggleBtn');
        const toggleText = document.getElementById('wcWtdToggleText');
        if (toggleBtn) toggleBtn.classList.remove('expanded');
        if (toggleText) toggleText.innerText = '展开全部';

        wcRenderWalletStackCards();
        overlay.classList.add('show');
    }
    window.wcOpenWalletThemeDrawer = wcOpenWalletThemeDrawer;

    // 关闭卡片装扮抽屉 (自动收回展开的堆叠卡片)
    function wcCloseWalletThemeDrawer(event) {
        if (event && event.target !== document.getElementById('wcWalletThemeDrawerOverlay')) return;
        const overlay = document.getElementById('wcWalletThemeDrawerOverlay');
        if (overlay) overlay.classList.remove('show');

        // 自动重置为收起状态
        wcIsStackExpanded = false;
        const stage = document.getElementById('wcWalletStackStage');
        const toggleBtn = document.getElementById('wcWtdToggleBtn');
        const toggleText = document.getElementById('wcWtdToggleText');
        if (stage) stage.classList.remove('expanded');
        if (toggleBtn) toggleBtn.classList.remove('expanded');
        if (toggleText) toggleText.innerText = '展开全部';
    }
    window.wcCloseWalletThemeDrawer = wcCloseWalletThemeDrawer;

    // 点击左下角【取消】
    function wcCancelWalletThemeDrawer() {
        wcWalletData.cardTheme = wcInitialThemeState.theme;
        wcWalletData.customCardCss = wcInitialThemeState.css;
        wcApplyWalletCustomStyleTag(wcInitialThemeState.css);
        wcSaveWalletData();
        wcRenderWallet();
        wcCloseWalletThemeDrawer();
    }
    window.wcCancelWalletThemeDrawer = wcCancelWalletThemeDrawer;

    // 点击右下角【确认】
    function wcConfirmWalletThemeDrawer() {
        wcSaveWalletData();
        wcRenderWallet();
        wcCloseWalletThemeDrawer();
        if (typeof showToast === 'function') showToast('已保存卡片装扮');
    }
    window.wcConfirmWalletThemeDrawer = wcConfirmWalletThemeDrawer;

    // 切换卡堆展开与收起 (附带带有边框的卡片按钮和翻转动画)
    function wcToggleWalletStack() {
        wcIsStackExpanded = !wcIsStackExpanded;
        const stage = document.getElementById('wcWalletStackStage');
        const toggleBtn = document.getElementById('wcWtdToggleBtn');
        const toggleText = document.getElementById('wcWtdToggleText');

        if (stage) stage.classList.toggle('expanded', wcIsStackExpanded);
        if (toggleBtn) toggleBtn.classList.toggle('expanded', wcIsStackExpanded);
        if (toggleText) toggleText.innerText = wcIsStackExpanded ? '收起卡堆' : '展开全部';

        wcRenderWalletStackCards();
    }
    window.wcToggleWalletStack = wcToggleWalletStack;

    // 渲染堆叠卡片舞台 (紧凑小尺寸，内部富图形细节)
    function wcRenderWalletStackCards() {
        const stage = document.getElementById('wcWalletStackStage');
        if (!stage) return;

        // 内置三套真实细节风格
        const builtInThemes = [
            { id: 'luxury', name: '曜石黑金', tag: 'Luxury', class: 'wc-stack-luxury', number: '•••• •••• •••• 8820', brand: 'VISA' },
            { id: 'cute', name: '柔萌星彩', tag: 'Cute', class: 'wc-stack-cute', number: '•••• •••• •••• 5200', brand: 'MasterCard' },
            { id: 'korean', name: '冷淡奶油', tag: 'Korean', class: 'wc-stack-korean', number: '•••• •••• •••• 1998', brand: 'AMEX' }
        ];

        const allCards = [...builtInThemes];
        (wcWalletData.customCardPresets || []).forEach(preset => {
            allCards.push({
                id: preset.id,
                name: preset.name,
                tag: 'Custom',
                class: 'wc-stack-custom',
                number: '•••• •••• •••• 9999',
                brand: 'PRESET',
                isCustom: true,
                css: preset.css
            });
        });

        stage.innerHTML = '';
        const currentTheme = wcWalletData.cardTheme || 'luxury';

        allCards.forEach((card, index) => {
            const el = document.createElement('div');
            el.className = `wc-stack-card-item ${card.class} ${card.id === currentTheme ? 'selected' : ''}`;

            if (!wcIsStackExpanded) {
                const offsetTop = index * 44; // 紧凑间距
                el.style.top = `${offsetTop}px`;
                el.style.zIndex = index + 1;
            } else {
                el.style.top = '0px';
                el.style.zIndex = 'auto';
            }

            const pattern = wcGetCardDecorPatternSvg(card.id);

            el.innerHTML = `
                ${pattern}
                <div class="wc-card-content-layer">
                    <div class="wc-stack-card-top">
                        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px; opacity: 0.9;">${card.tag} · ${card.name}</span>
                        <div class="wc-chip-visual"></div>
                    </div>
                    <div class="wc-stack-card-mid" style="font-size: 13px; font-family: monospace; letter-spacing: 1px;">${card.number}</div>
                    <div class="wc-stack-card-bot" style="font-size: 11px;">
                        <span style="opacity: 0.7;">${card.isCustom ? '自定义预设' : 'Design Card'}</span>
                        <span style="font-weight: 800; font-style: italic; letter-spacing: 0.5px;">${card.brand}</span>
                    </div>
                </div>
            `;

            el.onclick = (e) => {
                e.stopPropagation();
                wcSelectWalletTheme(card);
            };

            stage.appendChild(el);
        });

        if (!wcIsStackExpanded) {
            stage.style.minHeight = `${(allCards.length - 1) * 44 + 175}px`;
        } else {
            stage.style.minHeight = 'auto';
        }
    }

    // 选择并应用卡片主题
    function wcSelectWalletTheme(card) {
        wcWalletData.cardTheme = card.id;

        if (card.isCustom) {
            wcWalletData.customCardCss = card.css || '';
            const cssInput = document.getElementById('wcWalletCustomCssInput');
            if (cssInput) cssInput.value = card.css || '';
        } else {
            // 如果切回内置主题，保留或按需重置
        }

        wcSaveWalletData();
        wcRenderWallet();
        wcRenderWalletStackCards();
        if (typeof showToast === 'function') showToast(`已应用【${card.name}】卡片风格`);
    }

    // 保存自定义 CSS 到预设并加入堆叠
    function wcSaveCustomCardPreset() {
        const cssInput = document.getElementById('wcWalletCustomCssInput');
        const css = cssInput ? cssInput.value.trim() : '';

        if (!css) {
            if (typeof showToast === 'function') showToast('请输入有效的 CSS 代码');
            return;
        }

        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('保存预设', { placeholder: '请输入预设名称' }, '保存').then(name => {
                if (name && name.trim()) {
                    const presetName = name.trim();
                    const newId = 'custom_' + Date.now();
                    if (!wcWalletData.customCardPresets) wcWalletData.customCardPresets = [];

                    wcWalletData.customCardPresets.push({
                        id: newId,
                        name: presetName,
                        css: css
                    });

                    wcWalletData.cardTheme = newId;
                    wcWalletData.customCardCss = css;
                    wcSaveWalletData();
                    wcRenderWallet();
                    wcRenderWalletStackCards();
                    if (typeof showToast === 'function') showToast('已保存并加入卡片堆叠！');
                }
            });
        }
    }
    window.wcSaveCustomCardPreset = wcSaveCustomCardPreset;

    // 启动即预热读取一次钱包数据
    if (typeof wcLoadWalletData === 'function') {
        wcLoadWalletData().catch(() => {});
    }

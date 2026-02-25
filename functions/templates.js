exports.EMAIL_TEMPLATES = {
    welcome01: (data) => ({
        subject: "Welcome to LOOKSMAXXKING - Your Journey Starts Now",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Welcome, ${data.name}!</h1>
                <p>Your journey to maximizing your potential begins now.</p>
                <p>We've successfully logged your first scan on ${data.scanDate}.</p>
                <a href="${data.ctaUrl}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Dashboard</a>
            </div>
        `
    }),
    trial_reminder: (data) => ({
        subject: "You Have 2 Free Scans Left",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Scans Running Low</h2>
                <p>Hey ${data.name}, you have ${data.scansRemaining} scans remaining.</p>
                <p>Upgrade now to unlock unlimited access.</p>
                <p>Use code <b>${data.discountCode}</b> for 20% off.</p>
                <a href="${data.upgradeUrl}" style="background: #d4af37; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Unlock Premium</a>
            </div>
        `
    }),
    premium_welcome: (data) => ({
        subject: "Welcome to Premium - Here's What's Next",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #d4af37;">ASCENSION GRANTED</h1>
                <p>Welcome to the elite tier, ${data.name}.</p>
                <p>You now have unlimited scans, coach access, and detailed AI analysis.</p>
                <a href="${data.dashboardUrl}" style="background: #000; color: #d4af37; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Command Center</a>
            </div>
        `
    }),
    referral_success: (data) => ({
        subject: `👑 BOUNTY CLAIMED — ${data.reward} Added to Your Account`,
        html: `
            <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
                <h1 style="color: #f59e0b; font-style: italic; letter-spacing: -1px;">BOUNTY CLAIMED</h1>
                <p style="color: #a1a1aa;">King ${data.name},</p>
                <p>Your empire grows. A new recruit has joined through your code.</p>
                <div style="background: #111; border: 1px solid #292929; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <p style="color: #f59e0b; font-weight: bold; margin: 0 0 4px;">BOUNTY REWARD</p>
                    <p style="font-size: 28px; font-weight: 900; color: #fff; margin: 0; font-style: italic;">${data.reward}</p>
                    <p style="color: #52525b; font-size: 12px; margin-top: 8px;">Total Recruits: ${data.totalRecruits}</p>
                </div>
                <p style="color: #a1a1aa;">10+ recruits unlocks <b style="color: #f59e0b;">GOLD BOUNTY HUNTER</b> status — 30 days premium per referral.</p>
                <a href="${data.shareUrl}" style="display: inline-block; background: #f59e0b; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 900; font-style: italic; letter-spacing: 1px;">RECRUIT MORE KINGS</a>
            </div>
        `
    }),
    recruit_welcome: (data) => ({
        subject: `You Were Invited — ${data.bonusScans} Free Scans Granted`,
        html: `
            <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
                <h1 style="color: #f59e0b; font-style: italic;">ALLY INVITATION</h1>
                <p><b>${data.referrerName}</b> personally invited you to join the LOOKSMAXXKING empire.</p>
                <div style="background: #111; border: 1px solid #f59e0b33; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <p style="color: #f59e0b; font-weight: bold; font-style: italic; margin: 0 0 4px;">RECRUIT BONUS</p>
                    <p style="font-size: 28px; font-weight: 900; color: #fff; margin: 0;">${data.bonusScans} FREE SCANS</p>
                </div>
                <p style="color: #a1a1aa;">Start your first forensic face audit now. Your rank awaits.</p>
                <a href="${data.ctaUrl}" style="display: inline-block; background: #fff; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 900; font-style: italic;">CLAIM YOUR SCANS</a>
            </div>
        `
    }),
    affiliate_monthly_report: (data) => ({
        subject: `👑 Your Monthly Bounty Report — ${data.totalRecruits} Total Recruits`,
        html: `
            <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
                <h1 style="color: #f59e0b; font-style: italic; letter-spacing: -1px;">MONTHLY BOUNTY REPORT</h1>
                <p style="color: #a1a1aa;">King ${data.name},</p>
                <p>Here's your empire summary for this month.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0;">
                    <div style="background: #111; border: 1px solid #292929; border-radius: 12px; padding: 20px; text-align: center;">
                        <p style="color: #52525b; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Total Recruits</p>
                        <p style="font-size: 36px; font-weight: 900; color: #f59e0b; margin: 0; font-style: italic;">${data.totalRecruits}</p>
                    </div>
                    <div style="background: #111; border: 1px solid #292929; border-radius: 12px; padding: 20px; text-align: center;">
                        <p style="color: #52525b; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Affiliate Tier</p>
                        <p style="font-size: 18px; font-weight: 900; color: #fff; margin: 0; font-style: italic;">${data.affiliateTier}</p>
                    </div>
                </div>
                <p style="color: #a1a1aa;">Recruit 10+ Kings to achieve <b style="color: #f59e0b;">GOLD BOUNTY HUNTER</b> status and earn 30 days per referral.</p>
                <a href="${data.shareUrl}" style="display: inline-block; background: #f59e0b; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 900; font-style: italic; letter-spacing: 1px; margin-top: 16px;">GROW YOUR EMPIRE</a>
            </div>
        `
    })
};

use anchor_lang::prelude::*;

// Accounts
#[account]
pub struct Match {
    pub creator: Pubkey,
    pub status: u8,        // 0: pending, 1: active, 2: settled
    pub pot: u64,          // total SOL in the match
    pub winner: Option<Pubkey>,
    pub created_at: i64,
    pub purchases: u32,
}

#[account]
pub struct Purchase {
    pub buyer: Pubkey,
    pub match_id: Pubkey,
    pub effect_type: u8,
    pub amount: u64,
    pub timestamp: i64,
}

// Events
#[event]
pub struct MatchCreated {
    pub match_addr: Pubkey,
    pub creator: Pubkey,
    pub timestamp: i64,
}
#[event]
pub struct PurchaseMade {
    pub buyer: Pubkey,
    pub match_addr: Pubkey,
    pub effect_type: u8,
    pub amount: u64,
    pub timestamp: i64,
}
#[event]
pub struct MatchSettled {
    pub match_addr: Pubkey,
    pub winner: Option<Pubkey>,
    pub pot: u64,
    pub timestamp: i64,
}

// Program
#[program]
pub mod indies_anchor {
    use super::*;

    pub fn create_match(ctx: Context<CreateMatch>) -> Result<()> {
        let match_acc = &mut ctx.accounts.match_acc;
        match_acc.creator = ctx.accounts.creator.key();
        match_acc.status = 0;
        match_acc.pot = 0;
        match_acc.winner = None;
        match_acc.created_at = Clock::get()?.unix_timestamp;
        match_acc.purchases = 0;
        emit!(MatchCreated {
            match_addr: ctx.accounts.match_acc.key(),
            creator: ctx.accounts.creator.key(),
            timestamp: match_acc.created_at,
        });
        Ok(())
    }

    pub fn make_purchase(ctx: Context<MakePurchase>, effect_type: u8, amount: u64) -> Result<()> {
        let purchase = &mut ctx.accounts.purchase;
        purchase.buyer = ctx.accounts.buyer.key();
        purchase.match_id = ctx.accounts.match_acc.key();
        purchase.effect_type = effect_type;
        purchase.amount = amount;
        purchase.timestamp = Clock::get()?.unix_timestamp;

        let match_acc = &mut ctx.accounts.match_acc;
        match_acc.pot = match_acc.pot.checked_add(amount).unwrap();
        match_acc.purchases = match_acc.purchases.checked_add(1).unwrap();
        emit!(PurchaseMade {
            buyer: ctx.accounts.buyer.key(),
            match_addr: ctx.accounts.match_acc.key(),
            effect_type,
            amount,
            timestamp: purchase.timestamp,
        });
        Ok(())
    }

    pub fn settle_match(ctx: Context<SettleMatch>, winner: Option<Pubkey>) -> Result<()> {
        let match_acc = &mut ctx.accounts.match_acc;
        match_acc.status = 2;
        match_acc.winner = winner;
        emit!(MatchSettled {
            match_addr: ctx.accounts.match_acc.key(),
            winner,
            pot: match_acc.pot,
            timestamp: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }
}

// Contexts
#[derive(Accounts)]
pub struct CreateMatch<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 1 + 8 + 33 + 8 + 4)] // size per Match
    pub match_acc: Account<'info, Match>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct MakePurchase<'info> {
    #[account(mut)]
    pub match_acc: Account<'info, Match>,
    #[account(init, payer = buyer, space = 8 + 32 + 32 + 1 + 8 + 8)] // size per Purchase
    pub purchase: Account<'info, Purchase>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct SettleMatch<'info> {
    #[account(mut, has_one = creator)]
    pub match_acc: Account<'info, Match>,
    pub creator: Signer<'info>,
}

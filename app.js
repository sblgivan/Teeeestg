// app.js

document.getElementById("startBtn").addEventListener("click", async () => {
    const api = new DerivAPI({ app_id: 64037 }); // Use your actual app ID

    try {
        const account = await api.account('pfm6nudgLi4aNys');
        const { balance, currency } = account;

        document.getElementById("balance").textContent = `Your current balance is: ${balance.currency} ${balance.display}`;

        const contract = await api.contract({
            contract_type: 'CALL',
            currency,
            amount: 10,
            duration: 15,
            duration_unit: 'm',
            symbol: 'frxUSDJPY',
            basis: 'stake',
        });

        contract.onUpdate(({ status, payout, bid_price }) => {
            if (status === 'proposal') {
                document.getElementById("payout").textContent = `Current payout: ${payout.currency} ${payout.display}`;
            } else if (status === 'open') {
                document.getElementById("bid_price").textContent = `Current bid price: ${bid_price.currency} ${bid_price.display}`;
            }
        });

        // Update profit status when sold
        await contract.onUpdate()
            .pipe(find(({ is_sold }) => is_sold)).toPromise();

        const { profit, status } = contract;
        document.getElementById("profit").textContent = `You ${status}: ${profit.currency} ${profit.display}`;

    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection when done
        api.basic.disconnect();
    }
});

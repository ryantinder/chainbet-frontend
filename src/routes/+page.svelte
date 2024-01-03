<script lang="ts">
    import { sectionIndex, games, sepoliaClient, fujiClient, walletClient, bets } from "$lib/stores";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getContract, zeroAddress } from "viem";
	import { FUJI_TOKEN, SEP_TOKEN, bet_template } from "$lib/contract";
	import { getAccount } from "@wagmi/core";
    import GameCard from "../components/GameCard.svelte";
    $: activeWeek = 9;

    $: account = getAccount()

    let isMobile = false;

    const handleWithdraw = async () => {
        try {
            if (!$walletClient) return
            const bet = $walletClient.chain.id == 11155111 ? getContract({...bet_template, publicClient: $sepoliaClient, walletClient: $walletClient}) 
                                                            : getContract({...bet_template, publicClient: $fujiClient, walletClient: $walletClient})
            await bet.write.withdraw()
        } catch (e: any) {
            alert(e.message);
        }
    }
    const handleSettle = async () => {
        try {
            if (!$walletClient) return
            const bet = $walletClient.chain.id == 11155111 ? getContract({...bet_template, publicClient: $sepoliaClient, walletClient: $walletClient}) 
                                                            : getContract({...bet_template, publicClient: $fujiClient, walletClient: $walletClient})
            await bet.write.settle()
        } catch (e: any) {
            alert(e.message);
        }
    }

    onMount(() => {
        isMobile = window.innerWidth < 768;
    })

    const test = async () => {
        try {
            if (!$walletClient) return
            const write_bet = getContract({...bet_template, walletClient: $walletClient, publicClient: $sepoliaClient, address: "0xa14DfbEcEA91df1f366f8ABfda621006Eb07b0FC"})
            // await write_bet.write._processResults([BigInt(2007236683), await write_bet.read.betInfo()])
        } catch (e: any) {
            alert(e.message);
        }
    }
</script>

<!-- <Header /> -->

<main class="flex font-mont flex-col">
    <!-- <div class="mb-4 text-base">
        You need {SEP_TOKEN.address} {'(Sepolia)'} or {FUJI_TOKEN.address} {'(Fuji)'} to bet. It is free to acquire
        through any block explorer via the {'drip()'} function.
    </div> -->
    <div class="mb-16">
        <div class="flex flex-col gap-2">
            {#if account}
                {#each $bets as bet}
                    {#if bet.coverAddr == account.address || bet.atsAddr == account.address }
                        {@const game = $games.find((x) => x.game.id == bet.matchId)}
                        {#if game}
                        <div class={`flex py-2 px-2 border rounded-lg justify-between items-center ${ bet.finished && "bg-gray"}`}>
                            <div class={`flex flex-col w-3/4 text-base gap-px items-start`}>
                                <div class="font-semibold">{game.game.date.date}: {game.teams.home.name} vs {game.teams.away.name}</div>
                                {#if bet.coverAddr == account.address}
                                <!-- Cover side available -->
                                    <div class="">Bet that the { bet.winner ? game.teams.away.name : game.teams.home.name } win by { Math.floor(bet.margin / 10 + 1)} points or more.</div>
                                {:else}
                                <!-- ATS side available -->
                                    <div class="">Bet that the { bet.winner ? game.teams.home.name : game.teams.away.name } win AT ALL {bet.margin / 10 > 1 ? `, or lose by ${Math.ceil(bet.margin / 10 - 1)} points or less.` : ""}</div>
                                {/if}
                            </div>
                            <div class={``}>
                                {#if bet.coverAddr != zeroAddress && bet.atsAddr != zeroAddress && game.game.status.short == 'FT'}
                                    <button 
                                        on:click={handleSettle}
                                        class="p-2 rounded-lg bg-green text-white font-semibold hover:outline outline-2 outline-gray">
                                        Process
                                    </button>
                                {:else if bet.coverAddr == zeroAddress || bet.atsAddr == zeroAddress}
                                    <button 
                                        on:click={handleWithdraw}
                                        class="p-2 rounded-lg bg-red text-white font-semibold hover:outline outline-2 outline-gray">
                                        Withdraw
                                    </button>
                                {:else if game.game.status.short != 'FT' && game.game.status.short != 'NS'}
                                    Live
                                {:else}
                                    <div class="font-semibold">🔒 Bet is on!</div>
                                {/if}
                            </div>
                        </div>
                        {/if}
                    {/if}
                {/each}
            {/if}
        <div>
    </div>

    <div class="bg-header py-3 my-shadow rounded-lg">
        <div class="flex flex-row flex-wrap gap-3 p-2 justify-center">
            {#each Array(18).fill(1).map((x, i) => x + i) as week}
                <button on:click={() => activeWeek = week} class={`font-bold text-xl my-shadow text-navy rounded-lg py-2 w-[10%] ${activeWeek == week ? 'bg-yellow' : 'bg-notwhite'}`}>{`Week ${week}`}</button>
            {/each}
        </div>
    </div>
    <div class="mt-5">
        <!-- {#if web3modal}
            <span class="flex justify-end ">
                <button class="p-2 px-3 bg-white outline outline-2 --outline-offset-2 outline-primary hover:outline-0 hover:bg-primary hover:text-white rounded-md text-primary font-bold font-mono" 
                on:click={ web3modal.openModal }>
                    {#if account.address}
                        {ensName ?? truncateAddress(account.address)}
                    {:else}
                        Connect Wallet
                    {/if}
                </button>
            </span>
        {/if} -->
        <!-- {Object.keys(data.games.response)} -->
        <div class="justify-center">
            <div class="flex flex-wrap items-start gap-3">
                {#if $games}
                    {#each $games.filter((x) => x.game.week == `Week ${activeWeek}`) as game}
                        <GameCard {game}/>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</main>

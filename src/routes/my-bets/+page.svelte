<script lang="ts">
    import { sectionIndex, games, sepoliaClient, fujiClient, walletClient, bets } from "$lib/stores";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getContract, zeroAddress } from "viem";
	import { FUJI_TOKEN, SEP_TOKEN, bet_template } from "$lib/contract";
	import { getAccount } from "@wagmi/core";
    import GameCard from "../../components/GameCard.svelte";
	import BetCard from "../../components/BetCard.svelte";
    $: activeWeek = 18;

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
    <div class="bg-header p-3 my-shadow rounded-lg text-3xl font-bold">
        My Bets
    </div>
    <div class="mb-16">
        <div class="flex flex-wrap gap-2">
            {#if account}
                {#each $bets as bet}
                    {#if bet.coverAddr == account.address || bet.atsAddr == account.address }
                        {@const game = $games.find((x) => x.game.id == bet.matchId)}
                        {#if game}
                            <BetCard {game} {bet} />
                        {/if}
                    {/if}
                {:else}
                    <div class="font-xl text-header mt-4 pl-3">No bets found. Place one!</div>
                {/each}
            {:else}
                <div class="font-xl text-header mt-4 pl-3">Connect your wallet to view your bets.</div>
            {/if}
        <div>
    </div>
</main>

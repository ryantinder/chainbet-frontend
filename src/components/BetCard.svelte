<script lang="ts">
	import { truncateAddress } from "$lib/helpers";
	import type { BetState, Game } from "$lib/interface";
	import { formatUnits, zeroAddress } from "viem";

    export let bet: BetState
    export let game: Game
    $: team1 = game.teams.away.name.split(" ").pop()
    $: team2 = game.teams.home.name.split(" ").pop()
</script>

<div class="rounded-md bg-notwhite w-[200px] border border-black border-px my-shadow">
    <!-- Top section, score and time left -->
    
    <!-- <div class="flex justify-between items-center p-2 border border-b-2 border-x-0 border-t-0 border-darkblue"> -->
        <!-- Score Away Team -->
        <!-- <div>
            
        </div>
    </div> -->
    <!-- Middle section, teams -->
    {#if bet.coverAddr == zeroAddress || bet.atsAddr == zeroAddress}
        <div class="flex gap-3 items-center justify-center px-2 py-3">
            <!-- Helmet 1 -->
            <img src={`/logos/${bet.winner ? team2 : team1}.png`} alt="" class="w-1/2 mx-auto" />
        </div>
        <div class="text-center text-base font-semibold px-2">
            {#if bet.coverAddr == zeroAddress}
            <!-- Cover side available -->
                <div class="">{ bet.winner ? team1 : team2 } by { Math.floor(bet.margin / 10 + 1)} points or more.</div>
            {:else}
            <!-- ATS side available -->
                <div class="">{ bet.winner ? team2 : team1 } win AT ALL {bet.margin / 10 > 1 ? `, or loss by ${Math.ceil(bet.margin / 10 - 1)} points or less.` : ""}</div>
            {/if}

        </div>
        <!-- Middle section, teams -->
        <div class="flex items-center m-2 px-2">
            <div class="text-xl flex-1 font-bold text-center">${formatUnits(bet.wager, 6)}</div>
            <button class="bg-yellow flex-1 px-3 py-px border-darkblue rounded-md text-xl font-bold my-shadow">Accept</button>
        </div>
    {:else}
        <img src={`/logos/${ bet.winner ? team1 : team2}.png`} class="w-2/3 mx-auto"/>
        <div class="text-xl font-semibold text-center w-full border border-b-2 border-navy border-x-0 border-t-0 pb-2">win by { Math.floor(bet.margin / 10 + 1)}</div>
        <div class="flex font-semibold gap-2 text-base items-center justify-center mt-2">
            <img src={`/logos/${ bet.winner ? team1 : team2}.png`} class="w-1/6"/>
            <div class="">{truncateAddress(bet.coverAddr)} </div>
        </div>
        <div class="flex font-semibold gap-2 text-base items-center justify-center mb-4">
            <img src={`/logos/${ bet.winner ? team2 : team1}.png`} class="w-1/6"/>
            <div class="">{truncateAddress(bet.atsAddr)} </div>
        </div>
        <div class="text-xl font-semibold text-center m-2 bg-header text-black rounded my-shadow">Wager: ${formatUnits(bet.wager, 6)}</div>

    {/if}

    <!-- Bet button -->
</div>
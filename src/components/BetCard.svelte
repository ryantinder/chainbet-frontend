<script lang="ts">
	import type { Game } from "$lib/interface";

    export let game: Game
    $: team1 = game.teams.away.name.split(" ").pop()
    $: team2 = game.teams.home.name.split(" ").pop()
</script>

<div class="rounded-md  bg-notwhite w-[200px] h-[220px] border border-black border-px my-shadow">
    <!-- Top section, score and time left -->
    <div class="flex justify-between items-center p-2 border border-b-2 border-x-0 border-t-0 border-darkblue">
        <!-- Score Away Team -->
        <div class="bg-red px-3 py-2 rounded-md my-shadow font-bold" >
            {game.scores.away.total}
        </div>
        <!-- Time remaining -->
        <div>
            {game.game.status.long}
        </div>
        <!-- Score home team -->
        <div class="bg-red px-3 py-2 rounded-md my-shadow font-bold" >
            {game.scores.home.total}
        </div>
    </div>
    <!-- Middle section, teams -->
    <div class="flex gap-3 items-center justify-center py-6 px-2 h-[100px]">
        <!-- Helmet 1 -->
        <div>
            <img src={`/logos/${team1}.png`} alt="" class="" />
        </div>
        <!-- Vs --> 
        <div class="font-bold text-2xl text-white bg-navy px-2 py-px rounded ">VS</div>
        <!-- Helmet 2 -->
        <div>
            <img src={`/logos/${team2}.png`} alt="" class="" />
        </div>

    </div>
    <!-- Middle section, teams -->
    <div class="flex justify-center mb-2">
        <button class="bg-yellow px-4 py-2 border-darkblue rounded-md text-xl font-bold my-shadow">Place Bet</button>
    </div>
    <!-- Bet button -->
</div>
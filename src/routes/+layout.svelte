<script lang="ts">
	import { configureChains, createConfig, getAccount, getWalletClient, sepolia, watchAccount, watchNetwork } from "@wagmi/core";
    import "../app.scss";
	import { bets, fujiClient, sepoliaClient, walletClient } from "$lib/stores";
	import { onDestroy, onMount } from "svelte";
	import { avalancheFuji } from "viem/chains";
	import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
	import { Web3Modal } from "@web3modal/html";
	import { FUJI_FACTORY_ADDRESS, SEP_FACTORY_ADDRESS, truncateAddress } from "$lib/helpers";
	import { parseAbiItem } from "viem";
	import { addBet, getFullBetsCreated } from "$lib/bets";
	import { fetchGames } from "$lib/api";
	import { goto } from "$app/navigation";
    $: account = getAccount()
    const chains = [sepolia, avalancheFuji]
    const projectId = '7a27253eb43a160e20a5c5130cda68fe'
    const { publicClient } = configureChains(
        chains,
        [w3mProvider({ projectId})]
    )

    const config = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ 
            projectId,
            chains: chains
        }),
        publicClient
    })

    const ethereumClient = new EthereumClient(config, chains)

    let web3modal: Web3Modal | undefined = undefined 
    const unwatchAcct = watchAccount(async (acct) => {
        console.log("setting account", acct)
        account = acct
    })
    const unwatchNetwork = watchNetwork(async (network) => {
        console.log("HERE", network.chain?.id)
        console.log("setting wallet", network.chain?.id)
        $walletClient = await getWalletClient({chainId: network.chain?.id})
    })
    const unwatchSepBets = $sepoliaClient.watchEvent({  
        address: SEP_FACTORY_ADDRESS,
        event: parseAbiItem('event BetCreated(address indexed creator, uint indexed matchId, address indexed bet)'),
        onLogs: logs => {
            console.log(logs)
            for (const log of logs) {
                addBet(true, log.args.bet!) 
            }
        }
    })
    const unwatchFujiBets = $fujiClient.watchEvent({  
        address: FUJI_FACTORY_ADDRESS,
        event: parseAbiItem('event BetCreated(address indexed creator, uint indexed matchId, address indexed bet)'),
        onLogs: logs => {
            console.log(logs)
            for (const log of logs) {
                addBet(false, log.args.bet!) 
            }
        }
    })
    const switchChain = async (sep: boolean) => {
        console.log($walletClient)
        if (!$walletClient) return;
        if (sep) {
            await $walletClient?.switchChain({ id: sepolia.id} )
        } else {
            await $walletClient?.switchChain({ id: avalancheFuji.id} )
        }
        $walletClient = $walletClient
    }
    onMount(() => {
        web3modal = new Web3Modal(
        { projectId },
        ethereumClient
        )
        getFullBetsCreated()
        fetchGames()
    })
    onDestroy(() => {
        unwatchNetwork()
        unwatchSepBets()
        unwatchFujiBets()
        unwatchAcct()
    })
</script>

<title>ChainBet</title>
<div class="bg-header px-16 py-6 border border-b-4 border-x-0 border-t-0 border-navy my-shadow flex items-center justify-between w-full">
    <div class="items-center">
        <div class="flex font-bold text-5xl text-navy">
            <div class="pl-2 py-3 rounded-l-xl border border-l-2 border-y-2 border-r-0 border-navy">ch</div>
            <div class="py-3 border border-2 border-x-0 border-y-2 border-header">ain</div>
            <div class="py-3 border border-2 border-x-0 border-y-2 border-header text-yellow">bet</div>
        </div>
    </div>
    <button class="text-2xl font-bold text-navy" on:click={() => goto('/')}>Games</button>
    <button class="text-2xl font-bold text-navy" on:click={() => goto('/my-bets')}>My Bets</button>
    {#if web3modal}
        <button class="bg-yellow text-white text-2xl font-bold px-4 py-3 rounded-lg my-shadow" 
        on:click={ async () => { web3modal?.openModal().then( () => { account = getAccount() }) } }>
            {#if account.address}
                {truncateAddress(account.address)}
            {:else}
                Connect Wallet
            {/if}
    </button>
    {/if}
</div>
<div class="bg-darkblue px-16 pt-4">

    <slot />
</div>
<div class="h-[200px]">&nbsp;</div>


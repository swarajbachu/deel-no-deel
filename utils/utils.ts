import { MiniKit } from "@worldcoin/minikit-js"

// export const signInWithWallet = async () => {
// 	const res = await fetch(`/api/nonce`)
// 	const { nonce } = await res.json()

// 	const generateMessageResult = MiniKit.commands.walletAuth({
// 		nonce: nonce,
// 		requestId: '0', // Optional
// 		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
// 		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
// 		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
// 	})
// }

export const signInWithWallet = async () => {
	if (!MiniKit.isInstalled()) {
		return
	}

	const res = await fetch(`/api/nonce`)
	const { nonce } = await res.json()

	const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
		nonce: nonce,
		requestId: '0', // Optional
		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
	})

	if (finalPayload.status === 'error') {
		return
	} else {
		const response = await fetch('/api/complete-siwe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				payload: finalPayload,
				nonce,
			}),
		})
        
        console.log("response",response)
   
	}
}

export const NONCE = "jskdjdksfhlsfjslfjldsfjklsdjfh"
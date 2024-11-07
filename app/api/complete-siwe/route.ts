import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/config'
import { db } from '@/server/db/db'
import { players } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload
	nonce: string
}

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.error();
    }
	const { payload, nonce } = (await req.json()) as IRequestPayload
	if (nonce != cookies().get('siwe')?.value) {
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: 'Invalid nonce',
		})
	}
	try {
		const validMessage = await verifySiweMessage(payload, nonce)
        await db.update(players).set({
            walletAddress: payload.address,
        }).where(eq(players.id, session?.user.id));
		return NextResponse.json({
			status: 'success',
			isValid: validMessage.isValid,
		})
	} catch (error: any) {
		// Handle errors in validation or processing
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: error.message,
		})
	}
}

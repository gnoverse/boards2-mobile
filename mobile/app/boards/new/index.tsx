import { useRouter } from 'expo-router'
import { BoardCreationData, createBoard } from '@gno/redux'
import { BoardsCreateTemplate } from '@gno/components/templates/BoardsCreateTemplate'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'
import { BREADCRUMBS } from '@gno/constants/Constants'

export default function Search() {
  const router = useRouter()

  const { send, pending } = useWalletTx(() => router.back())

  const onCreate = async (board: BoardCreationData) => {
    await send(createBoard(board))
  }

  return (
    <BoardsCreateTemplate loading={pending} onCreate={onCreate} breadcrumbItems={BREADCRUMBS} onBackPress={() => router.back()} />
  )
}

import { useNavigation, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { selectAccount, selectThreadBoard, threadCreate, useAppSelector } from '@gno/redux'
import { BREADCRUMBS } from '@gno/constants/Constants'
import { ThreadsCreateTemplate } from '@gno/components/templates/ThreadsCreateTemplate'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'
import { CreateThreadFormData } from '@gno/components/threads/CreateThreadForm'

export default function Search() {
  const navigation = useNavigation()
  const router = useRouter()
  const account = useAppSelector(selectAccount)
  const board = useAppSelector(selectThreadBoard)

  const { send, pending } = useWalletTx(() => router.back())

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (!account) throw new Error('No active account')
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const onCreate = async (form: CreateThreadFormData) => {
    if (!board) throw new Error('No active board')
    await send(threadCreate({ ...form, boardId: board.id.toString() }))
  }

  return (
    <ThreadsCreateTemplate
      loading={pending}
      onCreate={onCreate}
      breadcrumbItems={[...BREADCRUMBS, board?.name || 'unknown']}
      onBackPress={() => router.back()}
    />
  )
}

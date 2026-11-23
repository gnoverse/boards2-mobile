import { useLocalSearchParams, useRouter } from 'expo-router'
import { selectThreadBoard, threadReplyAndRedirectToSign, useAppSelector } from '@gno/redux'
import { BREADCRUMBS } from '@gno/constants/Constants'
import { ThreadsReplyTemplate } from '@gno/components/templates/ThreadsReplyTemplate'
import ReplyThreadForm, { CreateReplyThreadFormData } from '@gno/components/threads/ReplyThreadForm'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'

export default function Page() {
  const router = useRouter()
  const board = useAppSelector(selectThreadBoard)
  const { threadId } = useLocalSearchParams()

  const { send, pending } = useWalletTx(() => router.back())

  const onCreate = async (form: CreateReplyThreadFormData) => {
    if (!board) throw new Error('No active board')
    await send(threadReplyAndRedirectToSign({ replyBody: form.replyBody }))
  }

  return (
    <ThreadsReplyTemplate
      breadcrumbItems={[...BREADCRUMBS, `${board?.name.toString()}`, `${threadId.toString()}`]}
      onBackPress={() => router.back()}
      title="Reply"
    >
      <ReplyThreadForm onCancel={() => router.back()} onCreate={onCreate} loading={pending} />
    </ThreadsReplyTemplate>
  )
}

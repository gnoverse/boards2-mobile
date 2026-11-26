import { useLocalSearchParams, useRouter } from 'expo-router'
import { selectThreadBoard, threadReplyAndRedirectToSign, useAppSelector } from '@gno/redux'
import { BREADCRUMBS } from '@gno/constants/Constants'
import { ThreadsReplyTemplate } from '@gno/components/templates/ThreadsReplyTemplate'
import ReplyThreadForm, { CreateReplyThreadFormData } from '@gno/components/threads/ReplyThreadForm'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'

// Reply to a comment or reply. This matches the gnoweb render route
// "{board}/{thread}/{reply}/reply".
export default function Page() {
  const router = useRouter()
  const board = useAppSelector(selectThreadBoard)
  const { threadId, commentId } = useLocalSearchParams<{ threadId: string; commentId: string }>()

  const { send, pending } = useWalletTx(() => router.back())

  const onCreate = async (form: CreateReplyThreadFormData) => {
    if (!board) throw new Error('No active board')
    await send(threadReplyAndRedirectToSign({ replyBody: form.replyBody }))
  }

  return (
    <ThreadsReplyTemplate
      breadcrumbItems={[...BREADCRUMBS, `${board?.name.toString()}`, threadId, commentId]}
      onBackPress={() => router.back()}
      title="Reply"
    >
      <ReplyThreadForm onCancel={() => router.back()} onCreate={onCreate} loading={pending} isComment />
    </ThreadsReplyTemplate>
  )
}

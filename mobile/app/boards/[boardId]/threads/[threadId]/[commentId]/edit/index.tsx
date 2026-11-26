import { useLocalSearchParams, useRouter } from 'expo-router'
import { editReplyAndRedirectToSign, selectReplyToEdit, selectThreadBoard, useAppSelector } from '@gno/redux'
import { BREADCRUMBS } from '@gno/constants/Constants'
import { ThreadsReplyTemplate } from '@gno/components/templates/ThreadsReplyTemplate'
import ReplyThreadForm, { CreateReplyThreadFormData } from '@gno/components/threads/ReplyThreadForm'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'

// Edit a comment or reply. This matches the gnoweb render route
// "{board}/{thread}/{reply}/edit".
export default function Page() {
  const router = useRouter()
  const board = useAppSelector(selectThreadBoard)
  const replyToEdit = useAppSelector(selectReplyToEdit)
  const { boardId, threadId, commentId } = useLocalSearchParams<{
    boardId: string
    threadId: string
    commentId: string
  }>()

  const { send, pending } = useWalletTx(() => router.back())

  const onCreate = async (form: CreateReplyThreadFormData) => {
    if (!board) throw new Error('No active board')
    await send(
      editReplyAndRedirectToSign({
        boardId: Number(boardId),
        threadId: Number(threadId),
        replyId: Number(commentId),
        replyBody: form.replyBody
      })
    )
  }

  // The body comes from the card that offered Edit. A stale one from an earlier
  // edit would silently overwrite this reply with another's text, so only use it
  // when it is the reply which the route names.
  const initialBody = replyToEdit?.id === Number(commentId) ? replyToEdit.body : ''

  return (
    <ThreadsReplyTemplate
      breadcrumbItems={[...BREADCRUMBS, `${board?.name.toString()}`, threadId, commentId]}
      onBackPress={() => router.back()}
      title="Edit"
    >
      <ReplyThreadForm
        onCancel={() => router.back()}
        onCreate={onCreate}
        loading={pending}
        isComment
        initialBody={initialBody}
        submitLabel="Save"
        helperText="Edit your reply"
      />
    </ThreadsReplyTemplate>
  )
}

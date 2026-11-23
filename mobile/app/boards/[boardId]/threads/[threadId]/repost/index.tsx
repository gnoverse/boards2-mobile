import { useLocalSearchParams, useRouter } from 'expo-router'
import { selectThreadBoard, selectThreadToRepost, threadRepostAndRedirectToSign, useAppSelector } from '@gno/redux'
import { BREADCRUMBS } from '@gno/constants/Constants'
import { ThreadsReplyTemplate } from '@gno/components/templates/ThreadsReplyTemplate'
import RepostThreadForm, { CreateRepostThreadFormData } from '@gno/components/threads/RepostThreadForm'
import { useWalletTx } from '@gno/hooks/use-wallet-tx'

export default function Page() {
  const router = useRouter()
  const board = useAppSelector(selectThreadBoard)
  const threadToRepost = useAppSelector(selectThreadToRepost)
  const { threadId } = useLocalSearchParams()

  const { send, pending } = useWalletTx(() => router.back())

  const onCreate = async (form: CreateRepostThreadFormData) => {
    if (!board) throw new Error('No active board')
    await send(
      threadRepostAndRedirectToSign({
        destinationBoardId: form.destinationBoardId,
        repostTitle: form.repostTitle,
        repostBody: form.repostBody
      })
    )
  }

  return (
    <ThreadsReplyTemplate
      breadcrumbItems={[...BREADCRUMBS, `${board?.name.toString()}`, `${threadId.toString()}`]}
      onBackPress={() => router.back()}
      title="Repost"
    >
      <RepostThreadForm
        onCancel={() => router.back()}
        onCreate={onCreate}
        loading={pending}
        initialTitle={threadToRepost?.title}
      />
    </ThreadsReplyTemplate>
  )
}

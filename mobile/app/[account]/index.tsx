import Layout from '@gno/components/layout'
import { colors } from '@gno/styles/colors'

export default function Page() {
  return (
    <Layout.Container>
      <Layout.Header style={{ backgroundColor: colors.grayscale[200] }} />
    </Layout.Container>
  )
}

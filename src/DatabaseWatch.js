import { h } from "vue"
export default {
    props: {
        tag: {
            type: String
        },
        collection: {
            required: true,
            type: String
        },
        query: {
            type: Function
        }
    },
    data() {
        return {
            docs: [],
            loading: true,
            error: false
        }
    },
    async created() {
        const db = this.$cloudbase.database()
        const query = this.query ? this.query(db.command) : {}
        db.collection(this.collection)
            .where(query)
            .watch({
                onChange: snapshot => {
                    this.loading = false
                    this.docs = snapshot.docs
                },
                onError: () => {}
            })
    },
    render() {
        const tag = this.tag || "div"
        let result = this.$slots.default
            ? this.$slots.default({
                  docs: this.docs,
                  loading: this.loading
              })
            : h(tag)
        if (Array.isArray(result)) {
            return h(tag, result)
        } else {
            return result
        }
    }
}

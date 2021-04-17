import isEqual from "lodash.isequal"
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
            error: null
        }
    },
    async created() {
        return this.fetchData()
    },
    watch: {
        collection() {
            return this.fetchData()
        },
        queryObject(newValue, oldValue) {
            if (isEqual(newValue, oldValue)) {
                return
            }
            return this.fetchData()
        }
    },
    computed: {
        queryObject() {
            const db = this.$cloudbase.database()
            const query = this.query ? this.query(db.command) : {}
            return query
        }
    },
    methods: {
        async fetchData() {
            try {
                const db = this.$cloudbase.database()
                const res = await db
                    .collection(this.collection)
                    .where(this.queryObject)
                    .get()
                this.docs = res.data
                this.loading = false
            } catch (e) {
                this.error = e
            }
        }
    },
    render() {
        const tag = this.tag || "div"
        let result = this.$slots.default
            ? this.$slots.default({
                  docs: this.docs,
                  loading: this.loading,
                  error: this.error
              })
            : h(tag)
        if (Array.isArray(result)) {
            return h(tag, result)
        } else {
            return result
        }
    }
}

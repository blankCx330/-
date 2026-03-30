class MyPromise{
    constructor(executor){
        this.state = 'pending'
        this.value = undefined

        this.onFulfilledCallback = []
        this.onRejectedCallback = []

        const resolve = value => {
            if(this.state === 'pending'){
                this.state = 'fulfilled'
                this.value = value

                this.onFulfilledCallback.forEach(cb => cb(this.value))
            }
        }

        const reject = reason => {
            if(this.state === 'pending'){
                this.state = 'rejected'
                this.value = reason
                
                this.onRejectedCallback.forEach(cb => cb(this.value))
            }
        }

        executor(resolve, reject)
    }

    then(onFulfilled, onRejected){
        onRejected = onRejected || (reason => {throw reason})
        return new MyPromise((resolve,reject)=>{
            if(this.state === 'fulfilled'){
                const results = onFulfilled(this.value)
                resolve(results)
            }
            if(this.state === 'rejected'){
                const results = onRejected(this.value)
                reject(results)
            }
            if(this.state === 'pending'){
                this.onFulfilledCallback.push(value => {
                    const results = onFulfilled(value)
                    resolve(results)
                })
                this.onRejectedCallback.push(value => {
                    const results = onRejected(value)
                    reject(results)
                })
            }
        })
    }

    catch(onRejected){
        return this.then(null, onRejected)
    }


}
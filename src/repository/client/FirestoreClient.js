const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const { appConfig, googleCloudConfig } = require('../../configs');

class FirestoreClient {

    constructor() {
        this.firestore = new Firestore({
            projectId: googleCloudConfig.projectId,
            keyFilename: path.join(__dirname, `../../../keys/${googleCloudConfig.environment}/service-account.json`),
        })
    }

    async save(collection, data) {
        const docRef = this.firestore.collection(collection).doc(data.id);
        await docRef.set(data)
        return data;
    }

    async get(collection, field, operator, value) {
        const collectionRef = this.firestore.collection(collection);
        const snapshot = await collectionRef.where(field, operator, value).get();
        if (snapshot.empty) {
            console.log(`[FirestoreClient] No matching documents - collection[${collection}] field[${field}] operator[${operator}] value[${value}]`);
        }
        return snapshot.docs;
    }

    async saveByPath(path, data) {
        const docRef = this.firestore.doc(path);
        await docRef.set(data);
    }

}

module.exports = new FirestoreClient();
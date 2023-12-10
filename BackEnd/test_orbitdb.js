import { createOrbitDB } from '@orbitdb/core'
import { create } from 'ipfs-core'

// Create an IPFS instance with defaults.
const ipfs = await create()

const orbitdb = await createOrbitDB({ ipfs })

const db = await orbitdb.open('my-db')

console.log('my-db address', db.address)

// Add some records to the db.
await db.add('hello world 1')
await db.add('hello world 2')

// Print out the above records.
console.log(await db.all())

// Close your db and stop OrbitDB and IPFS.
await db.close()
await orbitdb.stop()
await ipfs.stop()
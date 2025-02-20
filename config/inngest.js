import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//inngest function to save user details to database
export const synchUserCreation = inngest.createFunction(
    {
        id:'synch-user-from-clerk',
    },
    { event: 'clerk/user.created' },
    async ({event}) => {
const { id,first_name, last_name, email_addresses, image_url} = event.data
const userData = {
    _id: id,
    email_addresses: email_addresses[0].email_addresses,
    name: first_name + ' ' + last_name,
    imageUrl: image_url,
}
await connectDB()
await User.create(userData)
}
)

//image function to update user data in database

export const synchUserUpdate = inngest.createFunction(
    {
        id:'synch-user-update-from-clerk',
    },
    { event: 'clerk/user.updated' },
    async ({event}) => {
        const { id,first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email_addresses: email_addresses[0].email_addresses,
            name: first_name + ' ' + last_name,
            imageUrl: image_url,
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngest function to delete user data from database

export const synchUserDeletion = inngest.createFunction(
    {
        id:'synch-user-deletion-from-clerk',
    },
    { event: 'clerk/user.deleted' },
    async ({event}) => {
        const { id } = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }

)


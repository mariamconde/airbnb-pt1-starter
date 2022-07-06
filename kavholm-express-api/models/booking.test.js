const { BadRequestError } = require("../utils/errors")
const Listing = require("./listing")
const Booking = require("./booking")
const {
 commonBeforeAll,
 commonBeforeEach,
 commonAfterEach,
 commonAfterAll,
 testListingIds,
} = require("../tests/common")
const db = require("../db")

 
beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)
 
describe("Booking", () => {
 // add a new describe
 describe("Test createBookings", () => {
   test("Can create a new booking with valid params", async () => {
     const user = { username: "jlo"}
     // then it should select one of the listing ids from the testListingIds array.
     const listingId = testListingIds[1]
     // it should then use the Listing model to fetch that listing.
     const listing = await Listing.fetchListingById(listingId)
     // next, it should create a newBooking object with startDate, endDate, and guests properties
     const newBooking = {
       startDate: "07-06-2022",
       endDate: "07-17-2022",
       guests: 5
 }
 // use the createBooking method on the Booking model to create a new booking using the newBooking object, listing, and user
 const booking = await Booking.createBooking({listing, user, newBooking})
     // checks that the booking returned by that model is equal to the expected booking containing the properties: id, startDate, etc...
     expect(booking).toEqual({
       id: expect.any(Number),
       startDate: new Date("07-06-2022"),
       endDate: new Date("07-17-2022") ,
       paymentMethod: "card",
       guests: newBooking.guests,
       listingId: listingId ,
       username: user.username ,
       userId: expect.any(Number) ,
       createdAt: expect.any(Date)
     })
   })
   // test
   test("Throws error with invalid params", async () => {
     // expect.assertions(1)
     const user = { username: "jlo" }
     const listingId = testListingIds[0]
     const listing = await Listing.fetchListingById(listingId)
 
     const endDate = "07-17-2022"
     const newBooking = { endDate }
 
       try {
         await Booking.createBooking({ newBooking, listing, user })
       } catch (err) {
         expect(err instanceof BadRequestError).toBeTruthy()
       }
   })
 })
 
 
 
 describe("Test listBookingsFromUser", () => {
   test("Fetches all of the authenticated users' bookings", async () => {
     const user = { username: "jlo" }
     const listingId = testListingIds[0]
     const listing = await Listing.fetchListingById(listingId)
 
     const bookings = await Booking.listBookingsFromUser(user)
     expect(bookings.length).toEqual(2)
 
     const firstBooking = bookings[bookings.length - 1]
 
     firstBooking.totalCost = Number(firstBooking.totalCost)
 
     expect(firstBooking).toEqual({
       id: expect.any(Number),
       startDate: new Date("03-05-2021"),
       endDate: new Date("03-07-2021"),
       paymentMethod: "card",
       guests: 1,
       username: "jlo",
       hostUsername: "lebron",
       totalCost: Math.ceil(3 * (Number(listing.price) + Number(listing.price) * 0.1)),
       listingId: listingId,
       userId: expect.any(Number),
       createdAt: expect.any(Date),
     })
   })
 
   test("Returns empty array when user hasn't booked anything", async () => {
     const user = { username: "lebron" }
 
     const bookings = await Booking.listBookingsFromUser(user)
     expect(bookings).toHaveLength(0)
   })
 })
 
 describe("Test listBookingsForUserListings", () => {
   test("Fetches all of the bookings for any listing the user owns", async () => {
     const user = { username: "lebron" }
     const listingId = testListingIds[0]
     const listing = await Listing.fetchListingById(listingId)
 
     const bookings = await Booking.listBookingsForUserListings(user)
     expect(bookings.length).toEqual(2)
 
     const firstBooking = bookings[bookings.length - 1]
 
     firstBooking.totalCost = Number(firstBooking.totalCost)
 
     expect(firstBooking).toEqual({
       id: expect.any(Number),
       startDate: new Date("03-05-2021"),
       endDate: new Date("03-07-2021"),
       paymentMethod: "card",
       guests: 1,
       username: "jlo",
       hostUsername: "lebron",
       totalCost: Math.ceil(3 * (Number(listing.price) + Number(listing.price) * 0.1)),
       listingId: listingId,
       userId: expect.any(Number),
       createdAt: expect.any(Date),
     })
   })
 
   test("Returns empty array when users listing have no bookings", async () => {
     const user = { username: "serena" }
 
     const bookings = await Booking.listBookingsForUserListings(user)
     expect(bookings).toHaveLength(0)
   })
 })
})
 

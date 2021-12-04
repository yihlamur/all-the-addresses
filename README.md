# THE PLAN

1. Hi USPS I live at this address, can you send me a QR code
2. Ok, here is you QR code in the mail.
3. Narrator: The QR code has two pieces of information:
    - The address of USPS's contract for that ZIP code
    - The address that the QR code was sent to
    - A unique single-use token
4. It opens a website, hosted by USPS that pops up metamask
5. Pressing a button on the website initiates a transaction, whose author needs to be USPS. Inputs to the function are, the physical address, and the end user's chain address

Now any website can verify that you live in a zip code. Unlocks communal voting, and all kinds of other applications 🎉

Challenge mode: creating a garden variety web app, that creates the QR code, associates it with an address, and servers up a page corresponding to that QR code, in order to prompt the user to connect.

export function Footer(){
  return (
    <footer className="border-t bg-white mt-10">
      <div className="container-px py-6 text-sm text-gray-600 flex flex-col md:flex-row md:items-center gap-2">
        <p>&copy; {new Date().getFullYear()} ButterBee. All rights reserved.</p>
        <div className="md:ml-auto">
          <span className="mr-2">Order on</span>
          <a className="underline text-primary" href="https://wa.me/8825755675?text=Hi%20ButterBee" aria-label="WhatsApp Order Link">WhatsApp</a>
        </div>
      </div>
    </footer>
  )
}

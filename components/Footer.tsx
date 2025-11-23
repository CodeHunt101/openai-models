import Link from 'next/link'

const Footer = () => (
  <footer className="text-center mt-10">
    <hr />
    <p className="text-center py-5">
      Crafted by{' '}
      <span className="font-black">
        <Link
          href="https://www.linkedin.com/in/harold-torres-marino/"
          target="_blank"
        >
          Harold Torres
        </Link>
      </span>
    </p>
  </footer>
)

export default Footer

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-10 text-sm text-muted-foreground">
      <div className="container flex flex-col gap-8 md:flex-row md:justify-between">
        {/* Branding */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Demam</h2>
          <p>Connecting merchants and sellers across Ethiopia.</p>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Demam Inc. All rights reserved.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-foreground">Links</h4>
          <ul className="space-y-1">
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-foreground">Follow us</h4>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface IdeaCardProps {
  _id: string;
  projectTitle: string;
  elevatorPitch?: string;
  techStack: string[];
  createdAt: string;
}

export function IdeaCard({
  _id,
  projectTitle,
  elevatorPitch,
  techStack,
  createdAt,
}: IdeaCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="line-clamp-2 font-heading leading-tight">
            {projectTitle}
          </CardTitle>
          <CardDescription className="text-xs">
            {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {elevatorPitch && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {elevatorPitch}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {techStack?.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
            {(techStack?.length || 0) > 4 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{techStack.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link 
            href={`/idea/${_id}`} 
            className={buttonVariants({ variant: "default", size: "sm" }) + " w-full flex items-center justify-center group"}
          >
            Explore Idea 
            <motion.div
              className="ml-2 flex items-center justify-center"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="size-4" />
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

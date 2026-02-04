interface PageHeaderProps {
  title: string;
  className?: string;
  description?: string;
}

export function PageHeader({ title, description, className = "" }: PageHeaderProps) {
  return (
    <div className="flex flex-col py-20 justify-center items-center rounded-md bg-gradient-to-t 
      from-background to-primary/10">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-2xl text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
 
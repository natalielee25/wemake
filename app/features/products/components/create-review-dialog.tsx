import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Form, useActionData } from "react-router";
import { Button } from "~/common/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/common/components/ui/dialog"
import InputPair from "~/common/components/ui/input-pair";
import { Label } from "~/common/components/ui/label";

type ReviewActionData = {
    ok?: boolean;
    formErrors?: {
        rating?: string[];
        review?: string[];
    };
};

export default function CreateReviewDialog() {
    const [rating, setRating] = useState<number>(0);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const actionData = useActionData() as ReviewActionData | undefined;
    return(
    <DialogContent className="text-left">
        <DialogHeader>
        <DialogTitle className="text-xl font-bold">
            What do you think of this product?
        </DialogTitle>
        <DialogDescription>
            Share your thoughts and experiences with this product.
        </DialogDescription>
        </DialogHeader>
        <Form className="space-y-3 text-left" method="post">
            <div className="space-y-3 mb-5">
                <Label className="flex flex-col gap-1 items-start text-left">
                    Rating
                    <small className="text-muted-foreground">Star your rating for this product</small>
                </Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="relative"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        >
                            <StarIcon 
                            className="size-5 text-yellow-400"
                            fill={
                                hoveredStar >= star || rating >=star ? "currentColor" : "none"
                            }/>
                            <input 
                                type="radio" 
                                value={star}
                                name="rating" 
                                required 
                                className="opacity-0 h-px w-px absolute"
                                onChange={() => setRating(star)}
                            />
                        </label>
                    ))}
                </div>
                {actionData?.formErrors?.rating && (
                    <p className="text-red-500">
                        {actionData.formErrors.rating.join(", ")}
                    </p>
                )}
            </div>
            <InputPair
                textArea
                required
                name="review"
                label="Review"
                description="Maximum 1000 characters"
                placeholder="Tell us more about your experience with this product"
            />
            {actionData?.formErrors?.review && (
                <p className="text-red-500">
                    {actionData.formErrors.review.join(", ")}
                </p>
            )}
            <DialogFooter>
            	<Button type="submit">Submit Review</Button>
            </DialogFooter>
        </Form>
  </DialogContent>
);
}   

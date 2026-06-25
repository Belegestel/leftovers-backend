import { recipe } from "../generated/prisma/client";

export function toRecipeListDto(r: recipe) {
  return {
    id: r.id,
    title: r.title,
    prep_time: r.prep_time,
  };
}

export function toRecipeDetailsDto(r: recipe) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    prep_time: r.prep_time,
    isPublic: r.isPublic,
    created_at: r.created_at,
    edited_at: r.edited_at,
    author_id: r.author_id,
  }
}

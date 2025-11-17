import { Prisma } from "@prisma/client";

// Post with all relations
export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: true;
    category: true;
    tags: true;
    comments: true;
    media: true;
  };
}>;

// Post with author and category only
export type PostWithAuthorCategory = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    tags: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
  };
}>;

// Comment with author and replies
export type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    replies: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;

// Category with children
export type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: {
    children: true;
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

// User safe (without password)
export type SafeUser = Omit<Prisma.UserGetPayload<{}>, "password">;
